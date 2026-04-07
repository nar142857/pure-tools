"use client";

import { useState, useCallback } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { FileDropZone } from "@/components/FileDropZone";
import { ProcessingStatus, ProcessStatus } from "@/components/ProcessingStatus";
import { downloadBlob, formatFileSize } from "@/lib/tools";

type OutputFormat = "png" | "jpeg";
type Resolution = 1 | 2 | 3;

interface PageResult {
  blob: Blob;
  fileName: string;
  pageNum: number;
  previewUrl: string;
}

export default function PdfToImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ProcessStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [format, setFormat] = useState<OutputFormat>("png");
  const [scale, setScale] = useState<Resolution>(2);
  const [imageResults, setImageResults] = useState<PageResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandedPage, setExpandedPage] = useState<number | null>(null);

  const handleFiles = useCallback((files: { file: File }[]) => {
    setFile(files[0].file);
    setStatus("idle");
    setImageResults([]);
    setError(null);
    setExpandedPage(null);
  }, []);

  const convert = useCallback(async () => {
    if (!file) return;

    setStatus("processing");
    setProgress(5);
    setError(null);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const arrayBuffer = await file.arrayBuffer();
      setProgress(10);

      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      const images: PageResult[] = [];

      const baseName = file.name.replace(/\.pdf$/i, "");

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) throw new Error("无法创建Canvas上下文");

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({ canvasContext: ctx, viewport }).promise;

        const mimeType = format === "png" ? "image/png" : "image/jpeg";
        const ext = format === "png" ? "png" : "jpg";

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error("导出图片失败"))),
            mimeType,
            0.92
          );
        });

        images.push({
          blob,
          fileName: `${baseName}_page${i}.${ext}`,
          pageNum: i,
          previewUrl: canvas.toDataURL(mimeType, 0.7),
        });

        setProgress(10 + ((i / totalPages) * 85));
      }

      setImageResults(images);
      setProgress(100);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "转换失败");
      setStatus("error");
    }
  }, [file, format, scale]);

  const downloadAll = useCallback(() => {
    imageResults.forEach((r) => downloadBlob(r.blob, r.fileName));
  }, [imageResults]);

  const reset = useCallback(() => {
    setFile(null);
    setImageResults([]);
    setStatus("idle");
    setProgress(0);
    setError(null);
    setExpandedPage(null);
  }, []);

  const totalOriginal = file?.size ?? 0;
  const totalConverted = imageResults.reduce((s, r) => s + r.blob.size, 0);

  const mainResult = imageResults.length > 0
    ? {
        originalSize: totalOriginal,
        compressedSize: totalConverted,
        duration: 0,
        fileName: `${imageResults.length} 张图片`,
        blob: imageResults[0].blob,
      }
    : undefined;

  return (
    <ToolPageLayout
      icon="📑"
      title="PDF转图片"
      description="将PDF每页转为PNG/JPG高清图片"
    >
      {!file && (
        <FileDropZone
          accept=".pdf,application/pdf"
          onFiles={handleFiles}
          description="支持 PDF 格式"
        />
      )}

      {file && status === "idle" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">{file.name}</span>
              <span className="text-gray-400">{formatFileSize(file.size)}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">输出格式</label>
              <div className="grid grid-cols-2 gap-3">
                {(["png", "jpeg"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`p-3 rounded-lg border-2 text-center transition-colors ${
                      format === f ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-sm font-medium">{f === "png" ? "PNG" : "JPG"}</div>
                    <div className="text-xs text-gray-400">{f === "png" ? "无损画质" : "体积更小"}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分辨率倍数: {scale}x
              </label>
              <input
                type="range"
                min={1}
                max={3}
                step={1}
                value={scale}
                onChange={(e) => setScale(parseInt(e.target.value) as Resolution)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1x (快速)</span>
                <span>3x (超清)</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={convert}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              开始转换
            </button>
            <button
              onClick={reset}
              className="py-3 px-6 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              重新选择
            </button>
          </div>
        </div>
      )}

      <ProcessingStatus
        status={status}
        progress={progress}
        result={mainResult}
        error={error || undefined}
        onDownload={downloadAll}
        onReset={reset}
      />

      {status === "done" && imageResults.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">
              转换结果 ({imageResults.length} 页)
            </h3>
            <button
              onClick={downloadAll}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              全部下载
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {imageResults.map((r) => (
              <div
                key={r.pageNum}
                className="group relative border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-blue-400 hover:shadow-md transition-all"
                onClick={() => setExpandedPage(expandedPage === r.pageNum ? null : r.pageNum)}
              >
                <div className="aspect-[3/4] bg-gray-50 flex items-center justify-center overflow-hidden">
                  <img
                    src={r.previewUrl}
                    alt={`第 ${r.pageNum} 页`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-2 flex items-center justify-between">
                  <span className="text-xs text-gray-600">第 {r.pageNum} 页</span>
                  <span className="text-xs text-gray-400">{formatFileSize(r.blob.size)}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadBlob(r.blob, r.fileName);
                  }}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full w-7 h-7 flex items-center justify-center shadow hover:bg-blue-50"
                  title="下载此页"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {expandedPage !== null && (() => {
            const r = imageResults.find((x) => x.pageNum === expandedPage);
            if (!r) return null;
            return (
              <div
                className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
                onClick={() => setExpandedPage(null)}
              >
                <div
                  className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-auto shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">第 {r.pageNum} 页</span>
                      <span className="text-sm text-gray-400">{formatFileSize(r.blob.size)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => downloadBlob(r.blob, r.fileName)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      >
                        下载此页
                      </button>
                      <button
                        onClick={() => setExpandedPage(null)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <img
                      src={r.previewUrl}
                      alt={`第 ${r.pageNum} 页`}
                      className="max-w-full max-h-[75vh] mx-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </ToolPageLayout>
  );
}
