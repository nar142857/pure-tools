"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { FileDropZone } from "@/components/FileDropZone";
import { ProcessingStatus, ProcessStatus } from "@/components/ProcessingStatus";
import { ImageCompareSlider, SinglePreview } from "@/components/ImageCompareSlider";
import { formatFileSize, downloadBlob } from "@/lib/tools";

interface FileItem {
  file: File;
  id: string;
}

interface CompressResult {
  originalSize: number;
  compressedSize: number;
  duration: number;
  fileName: string;
  blob: Blob;
  skipped: boolean;
  originalUrl: string;
  compressedUrl: string;
}

type OutputMode = "auto" | "png" | "jpeg";

export default function ImageCompressPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [status, setStatus] = useState<ProcessStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [quality, setQuality] = useState(0.7);
  const [maxWidth, setMaxWidth] = useState(0);
  const [outputMode, setOutputMode] = useState<OutputMode>("auto");
  const [results, setResults] = useState<CompressResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);

  const originalUrls = useMemo(() => {
    return files.map((f) => URL.createObjectURL(f.file));
  }, [files]);

  const handleFiles = useCallback((newFiles: FileItem[]) => {
    setFiles(newFiles);
    setResults([]);
    setStatus("idle");
    setError(null);
    setPreviewIndex(0);
  }, []);

  const compressImage = useCallback(
    (file: File, originalUrl: string): Promise<CompressResult> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
          URL.revokeObjectURL(url);

          let w = img.width;
          let h = img.height;

          if (maxWidth > 0 && w > maxWidth) {
            const ratio = maxWidth / w;
            w = maxWidth;
            h = Math.round(h * ratio);
          }

          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("无法创建Canvas上下文"));
            return;
          }

          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);

          const isPngInput = file.type === "image/png";
          const useJpeg =
            outputMode === "jpeg" ||
            (outputMode === "auto" && !isPngInput);

          const mimeType = useJpeg ? "image/jpeg" : "image/png";
          const ext = useJpeg ? ".jpg" : ".png";
          const baseName = file.name.replace(/\.[^.]+$/, "");

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("压缩失败"));
                return;
              }

              if (blob.size >= file.size && maxWidth === 0) {
                resolve({
                  originalSize: file.size,
                  compressedSize: file.size,
                  duration: 0,
                  fileName: file.name,
                  blob: file,
                  skipped: true,
                  originalUrl,
                  compressedUrl: originalUrl,
                });
                return;
              }

              resolve({
                originalSize: file.size,
                compressedSize: blob.size,
                duration: 0,
                fileName: `${baseName}_compressed${ext}`,
                blob,
                skipped: false,
                originalUrl,
                compressedUrl: URL.createObjectURL(blob),
              });
            },
            mimeType,
            useJpeg ? quality : undefined
          );
        };

        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error(`无法加载图片: ${file.name}`));
        };

        img.src = url;
      });
    },
    [quality, maxWidth, outputMode]
  );

  const startCompress = useCallback(async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setProgress(0);
    setError(null);
    const allResults: CompressResult[] = [];
    const startTime = Date.now();

    try {
      for (let i = 0; i < files.length; i++) {
        const result = await compressImage(files[i].file, originalUrls[i]);
        result.duration = Date.now() - startTime;
        allResults.push(result);
        setProgress(((i + 1) / files.length) * 100);
      }
      setResults(allResults);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "处理失败");
      setStatus("error");
    }
  }, [files, originalUrls, compressImage]);

  const downloadAll = useCallback(() => {
    if (results.length === 1) {
      downloadBlob(results[0].blob, results[0].fileName);
      return;
    }
    results.forEach((r) => downloadBlob(r.blob, r.fileName));
  }, [results]);

  const downloadSingle = useCallback((r: CompressResult) => {
    downloadBlob(r.blob, r.fileName);
  }, []);

  const reset = useCallback(() => {
    setFiles([]);
    setResults([]);
    setStatus("idle");
    setProgress(0);
    setError(null);
    setPreviewIndex(0);
  }, []);

  const mainResult = results.length > 0
    ? {
        originalSize: results.reduce((s, r) => s + r.originalSize, 0),
        compressedSize: results.reduce((s, r) => s + r.compressedSize, 0),
        duration: results[0].duration,
        fileName: results.length === 1 ? results[0].fileName : `${results.length} 个文件`,
        blob: results[0].blob,
      }
    : undefined;

  return (
    <ToolPageLayout
      icon="🖼️"
      title="图片压缩"
      description="压缩JPG/PNG/WebP图片，减小文件体积，支持批量处理"
    >
      {files.length === 0 && (
        <FileDropZone
          accept=".jpg,.jpeg,.png,.webp,image/*"
          multiple
          onFiles={handleFiles}
          description="支持 JPG、PNG、WebP，可多选"
        />
      )}

      {files.length > 0 && status === "idle" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-3">已选文件 ({files.length})</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {files.map((f) => (
                <div key={f.id} className="flex items-center justify-between text-sm py-1">
                  <span className="text-gray-700 truncate">{f.file.name}</span>
                  <span className="text-gray-400 ml-2 shrink-0">{formatFileSize(f.file.size)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">输出格式</label>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { value: "auto" as const, label: "智能", desc: "自动选择最优格式" },
                  { value: "jpeg" as const, label: "JPEG", desc: "体积最小，有损" },
                  { value: "png" as const, label: "PNG", desc: "无损，支持透明" },
                ]).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setOutputMode(opt.value)}
                    className={`p-3 rounded-lg border-2 text-center transition-colors ${
                      outputMode === opt.value
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                压缩质量: {Math.round(quality * 100)}%
              </label>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>最小体积</span>
                <span>最高质量</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最大宽度: {maxWidth === 0 ? "不限制" : `${maxWidth}px`}
              </label>
              <input
                type="range"
                min={0}
                max={4096}
                step={128}
                value={maxWidth}
                onChange={(e) => setMaxWidth(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>原始尺寸</span>
                <span>4096px</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={startCompress}
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

      {status !== "idle" && (
        <ProcessingStatus
          status={status}
          progress={progress}
          result={mainResult}
          error={error || undefined}
          onDownload={downloadAll}
          onReset={reset}
        />
      )}

      {status === "done" && results.length >= 1 && (
        <div className="space-y-4">
          {results.map((r, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 text-sm truncate">{r.fileName}</span>
                  {r.skipped && <span className="text-xs text-amber-500">(已保持原文件)</span>}
                </div>
                <div className="flex items-center gap-3 shrink-0 text-sm">
                  <span className="text-gray-400">{formatFileSize(r.originalSize)}</span>
                  <span className="text-gray-400">→</span>
                  <span className={r.skipped ? "text-amber-500 font-medium" : "text-green-600 font-medium"}>
                    {formatFileSize(r.compressedSize)}
                  </span>
                  {!r.skipped && r.originalSize > 0 && (
                    <span className="text-green-600 text-xs">
                      -{Math.round((1 - r.compressedSize / r.originalSize) * 100)}%
                    </span>
                  )}
                  <button
                    onClick={() => downloadSingle(r)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    下载
                  </button>
                </div>
              </div>

              {!r.skipped ? (
                <ImageCompareSlider
                  originalUrl={r.originalUrl}
                  compressedUrl={r.compressedUrl}
                  originalLabel={`原图 ${formatFileSize(r.originalSize)}`}
                  compressedLabel={`压缩后 ${formatFileSize(r.compressedSize)}`}
                />
              ) : (
                <SinglePreview imageUrl={r.originalUrl} label="原始文件（未压缩）" />
              )}
            </div>
          ))}
        </div>
      )}
    </ToolPageLayout>
  );
}
