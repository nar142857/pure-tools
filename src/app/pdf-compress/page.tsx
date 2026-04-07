"use client";

import { useState, useCallback } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { FileDropZone } from "@/components/FileDropZone";
import { ProcessingStatus, ProcessStatus } from "@/components/ProcessingStatus";
import { SinglePreview } from "@/components/ImageCompareSlider";
import { downloadBlob, formatFileSize } from "@/lib/tools";
import { PDFDocument } from "pdf-lib";

type CompressLevel = "light" | "standard" | "maximum";

const LEVEL_CONFIG: Record<CompressLevel, { scale: number; quality: number; label: string; desc: string; icon: string }> = {
  light: { scale: 2, quality: 0.85, label: "轻度", desc: "质量最佳", icon: "🟢" },
  standard: { scale: 1.5, quality: 0.6, label: "标准", desc: "平衡体积与质量", icon: "🟡" },
  maximum: { scale: 1, quality: 0.35, label: "极限", desc: "最小体积", icon: "🔴" },
};

interface PdfPreview {
  originalUrl: string;
  compressedUrl: string;
  pageNum: number;
}

export default function PdfCompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ProcessStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [level, setLevel] = useState<CompressLevel>("standard");
  const [result, setResult] = useState<{
    originalSize: number;
    compressedSize: number;
    duration: number;
    fileName: string;
    blob: Blob;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<PdfPreview | null>(null);

  const handleFiles = useCallback((files: { file: File }[]) => {
    setFile(files[0].file);
    setStatus("idle");
    setResult(null);
    setError(null);
    setPreview(null);
  }, []);

  const compressPdf = useCallback(async () => {
    if (!file) return;

    setStatus("processing");
    setProgress(5);
    const startTime = Date.now();
    const config = LEVEL_CONFIG[level];

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const arrayBuffer = await file.arrayBuffer();
      setProgress(10);

      const sourcePdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = sourcePdf.numPages;
      setProgress(15);

      const newPdf = await PDFDocument.create();
      let originalPreviewUrl = "";
      let compressedPreviewUrl = "";

      for (let i = 1; i <= totalPages; i++) {
        const page = await sourcePdf.getPage(i);
        const viewport = page.getViewport({ scale: config.scale });

        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) throw new Error("无法创建Canvas上下文");

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({ canvasContext: ctx, viewport }).promise;

        const jpegDataUrl = canvas.toDataURL("image/jpeg", config.quality);
        const jpegBase64 = jpegDataUrl.split(",")[1];
        const jpegBytes = Uint8Array.from(atob(jpegBase64), (c) => c.charCodeAt(0));

        const jpgImage = await newPdf.embedJpg(jpegBytes);

        const origViewport = page.getViewport({ scale: 1 });
        const pdfPage = newPdf.addPage([origViewport.width, origViewport.height]);

        pdfPage.drawImage(jpgImage, {
          x: 0,
          y: 0,
          width: origViewport.width,
          height: origViewport.height,
        });

        if (i === 1) {
          compressedPreviewUrl = jpegDataUrl;

          const origViewport2 = page.getViewport({ scale: config.scale });
          const origCanvas = document.createElement("canvas");
          origCanvas.width = origViewport2.width;
          origCanvas.height = origViewport2.height;
          const origCtx = origCanvas.getContext("2d")!;
          origCtx.fillStyle = "#FFFFFF";
          origCtx.fillRect(0, 0, origCanvas.width, origCanvas.height);
          await page.render({ canvasContext: origCtx, viewport: origViewport2 }).promise;
          originalPreviewUrl = origCanvas.toDataURL("image/png");
        }

        setProgress(15 + ((i / totalPages) * 75));
      }

      const compressedBytes = await newPdf.save({
        useObjectStreams: true,
      });

      const blob = new Blob([new Uint8Array(compressedBytes)], { type: "application/pdf" });
      const baseName = file.name.replace(/\.pdf$/i, "");

      if (blob.size >= file.size) {
        setResult({
          originalSize: file.size,
          compressedSize: file.size,
          duration: Date.now() - startTime,
          fileName: file.name,
          blob: new Blob([arrayBuffer], { type: "application/pdf" }),
        });
      } else {
        setResult({
          originalSize: file.size,
          compressedSize: blob.size,
          duration: Date.now() - startTime,
          fileName: `${baseName}_compressed.pdf`,
          blob,
        });
      }

      setPreview({
        originalUrl: originalPreviewUrl,
        compressedUrl: compressedPreviewUrl,
        pageNum: 1,
      });

      setProgress(100);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "PDF压缩失败，请确认文件是否损坏");
      setStatus("error");
    }
  }, [file, level]);

  const reset = useCallback(() => {
    setFile(null);
    setResult(null);
    setStatus("idle");
    setProgress(0);
    setError(null);
    setPreview(null);
  }, []);

  return (
    <ToolPageLayout
      icon="📄"
      title="PDF压缩"
      description="多级压缩PDF文件，减小文件体积"
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

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              压缩级别
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["light", "standard", "maximum"] as const).map((lvl) => {
                const cfg = LEVEL_CONFIG[lvl];
                return (
                  <button
                    key={lvl}
                    onClick={() => setLevel(lvl)}
                    className={`p-3 rounded-lg border-2 text-center transition-colors ${
                      level === lvl
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-lg">{cfg.icon}</div>
                    <div className="text-sm font-medium">{cfg.label}</div>
                    <div className="text-xs text-gray-400">{cfg.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
            💡 压缩原理：将PDF每页渲染为图片后以JPEG重新编码，可有效减小包含大量图片的PDF文件体积。文字为主的PDF效果可能有限。
          </div>

          <div className="flex gap-3">
            <button
              onClick={compressPdf}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              开始压缩
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
        result={result || undefined}
        error={error || undefined}
        onDownload={() => result && downloadBlob(result.blob, result.fileName)}
        onReset={reset}
      />

      {status === "done" && result && result.compressedSize >= result.originalSize && (
        <div className="bg-amber-50 rounded-lg p-3 text-sm text-amber-700">
          ⚠️ 压缩后体积未减小（该文件可能已经过压缩），已为您保留原始文件。
        </div>
      )}

      {status === "done" && preview && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <h3 className="font-medium text-gray-900">首页预览对比</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-gray-500 text-center">
                原始 {formatFileSize(result!.originalSize)}
              </div>
              <SinglePreview imageUrl={preview.originalUrl} label="原始首页" />
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-500 text-center">
                压缩后 {formatFileSize(result!.compressedSize)}
              </div>
              <SinglePreview imageUrl={preview.compressedUrl} label="压缩后首页" />
            </div>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
