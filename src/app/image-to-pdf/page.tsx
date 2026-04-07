"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { FileDropZone } from "@/components/FileDropZone";
import { ProcessingStatus, ProcessStatus } from "@/components/ProcessingStatus";
import { ImageCompareSlider, SinglePreview } from "@/components/ImageCompareSlider";
import { downloadBlob, formatFileSize } from "@/lib/tools";
import { PDFDocument } from "pdf-lib";

type PageSize = "a4" | "letter" | "fit";

export default function ImageToPdfPage() {
  const [files, setFiles] = useState<{ file: File; id: string }[]>([]);
  const [status, setStatus] = useState<ProcessStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [pageSize, setPageSize] = useState<PageSize>("fit");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [result, setResult] = useState<{
    originalSize: number;
    compressedSize: number;
    duration: number;
    fileName: string;
    blob: Blob;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sourcePreviews, setSourcePreviews] = useState<string[]>([]);

  const filePreviews = useMemo(() => {
    return files.map((f) => URL.createObjectURL(f.file));
  }, [files]);

  const handleFiles = useCallback((newFiles: { file: File; id: string }[]) => {
    setFiles(newFiles);
    setResult(null);
    setStatus("idle");
    setError(null);
    setPreviewUrl(null);
    setSourcePreviews([]);
  }, []);

  const convert = useCallback(async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setProgress(5);
    const startTime = Date.now();

    try {
      const pdfDoc = await PDFDocument.create();
      const previews: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i].file;
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);

        let image;
        const isJpg = file.type === "image/jpeg" || file.name.toLowerCase().endsWith(".jpg") || file.name.toLowerCase().endsWith(".jpeg");

        if (isJpg) {
          image = await pdfDoc.embedJpg(bytes);
        } else {
          image = await pdfDoc.embedPng(bytes);
        }

        previews.push(filePreviews[i]);

        const imgWidth = image.width;
        const imgHeight = image.height;

        let pageWidth: number;
        let pageHeight: number;

        if (pageSize === "fit") {
          pageWidth = imgWidth;
          pageHeight = imgHeight;
        } else {
          const dims = pageSize === "a4"
            ? { w: 595.28, h: 841.89 }
            : { w: 612, h: 792 };

          if (orientation === "landscape") {
            pageWidth = dims.h;
            pageHeight = dims.w;
          } else {
            pageWidth = dims.w;
            pageHeight = dims.h;
          }
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        if (pageSize === "fit") {
          page.drawImage(image, {
            x: 0,
            y: 0,
            width: imgWidth,
            height: imgHeight,
          });
        } else {
          const margin = 20;
          const availW = pageWidth - margin * 2;
          const availH = pageHeight - margin * 2;
          const sc = Math.min(availW / imgWidth, availH / imgHeight);
          const drawW = imgWidth * sc;
          const drawH = imgHeight * sc;
          const x = (pageWidth - drawW) / 2;
          const y = (pageHeight - drawH) / 2;

          page.drawImage(image, { x, y, width: drawW, height: drawH });
        }

        setProgress(((i + 1) / files.length) * 70);
      }

      const pdfBytes = await pdfDoc.save();
      setProgress(80);

      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const totalOriginal = files.reduce((s, f) => s + f.file.size, 0);

      setResult({
        originalSize: totalOriginal,
        compressedSize: blob.size,
        duration: Date.now() - startTime,
        fileName: "images_combined.pdf",
        blob,
      });

      setSourcePreviews(previews);

      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const pdfData = new Uint8Array(pdfBytes);
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
        const firstPage = await pdf.getPage(1);
        const vp = firstPage.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width;
        canvas.height = vp.height;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await firstPage.render({ canvasContext: ctx, viewport: vp }).promise;
        setPreviewUrl(canvas.toDataURL("image/jpeg", 0.8));
      } catch {
        setPreviewUrl(null);
      }

      setProgress(100);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "转换失败，请确认图片格式是否支持");
      setStatus("error");
    }
  }, [files, pageSize, orientation, filePreviews]);

  const reset = useCallback(() => {
    setFiles([]);
    setResult(null);
    setStatus("idle");
    setProgress(0);
    setError(null);
    setPreviewUrl(null);
    setSourcePreviews([]);
  }, []);

  return (
    <ToolPageLayout
      icon="📎"
      title="图片转PDF"
      description="多张图片合并为一个PDF文档"
    >
      {files.length === 0 && (
        <FileDropZone
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          multiple
          onFiles={handleFiles}
          description="支持 JPG、PNG，可多选"
        />
      )}

      {files.length > 0 && status === "idle" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-2">
              已选图片 ({files.length})
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-2">
              {filePreviews.map((url, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                  <img src={url} alt={files[i].file.name} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto mt-2">
              {files.map((f, i) => (
                <div key={f.id} className="flex items-center justify-between text-sm py-0.5">
                  <span className="text-gray-700 truncate">
                    {i + 1}. {f.file.name}
                  </span>
                  <span className="text-gray-400 ml-2 shrink-0">{formatFileSize(f.file.size)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">页面大小</label>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { value: "fit" as const, label: "适应图片", desc: "保持原始尺寸" },
                  { value: "a4" as const, label: "A4", desc: "210×297mm" },
                  { value: "letter" as const, label: "Letter", desc: "8.5×11in" },
                ]).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPageSize(opt.value)}
                    className={`p-3 rounded-lg border-2 text-center transition-colors ${
                      pageSize === opt.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-sm font-medium">{opt.label}</div>
                    <div className="text-xs text-gray-400">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {pageSize !== "fit" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">方向</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setOrientation("portrait")}
                    className={`p-3 rounded-lg border-2 text-center ${
                      orientation === "portrait" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                    }`}
                  >
                    纵向
                  </button>
                  <button
                    onClick={() => setOrientation("landscape")}
                    className={`p-3 rounded-lg border-2 text-center ${
                      orientation === "landscape" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                    }`}
                  >
                    横向
                  </button>
                </div>
              </div>
            )}
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
        result={result || undefined}
        error={error || undefined}
        onDownload={() => result && downloadBlob(result.blob, result.fileName)}
        onReset={reset}
      />

      {status === "done" && previewUrl && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <h3 className="font-medium text-gray-900">PDF预览（首页）</h3>
          <SinglePreview imageUrl={previewUrl} label={`共 ${files.length} 页`} />
        </div>
      )}

      {status === "done" && sourcePreviews.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 mb-3">包含的图片</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {sourcePreviews.map((url, i) => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                <img src={url} alt={`图片 ${i + 1}`} className="w-full h-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
