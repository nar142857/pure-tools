"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { FileDropZone } from "@/components/FileDropZone";
import { ProcessingStatus, ProcessStatus } from "@/components/ProcessingStatus";
import { ImageCompareSlider, SinglePreview } from "@/components/ImageCompareSlider";
import { downloadBlob, formatFileSize } from "@/lib/tools";

type OutputFormat = "jpeg" | "png" | "webp";

interface ConvertResult {
  originalSize: number;
  compressedSize: number;
  duration: number;
  fileName: string;
  blob: Blob;
  originalUrl: string;
  convertedUrl: string;
}

export default function ImageConvertPage() {
  const [files, setFiles] = useState<{ file: File; id: string }[]>([]);
  const [status, setStatus] = useState<ProcessStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("png");
  const [quality, setQuality] = useState(0.92);
  const [results, setResults] = useState<ConvertResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const originalUrls = useMemo(() => {
    return files.map((f) => URL.createObjectURL(f.file));
  }, [files]);

  const handleFiles = useCallback((newFiles: { file: File; id: string }[]) => {
    setFiles(newFiles);
    setResults([]);
    setStatus("idle");
    setError(null);
    setExpandedIndex(null);
  }, []);

  const convertImage = useCallback(
    (file: File, originalUrl: string): Promise<ConvertResult> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
          URL.revokeObjectURL(url);

          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("无法创建Canvas"));
            return;
          }

          ctx.drawImage(img, 0, 0);

          const mimeMap: Record<OutputFormat, string> = {
            jpeg: "image/jpeg",
            png: "image/png",
            webp: "image/webp",
          };
          const extMap: Record<OutputFormat, string> = {
            jpeg: "jpg",
            png: "png",
            webp: "webp",
          };

          const mimeType = mimeMap[outputFormat];
          const baseName = file.name.replace(/\.[^.]+$/, "");

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("转换失败"));
                return;
              }
              resolve({
                originalSize: file.size,
                compressedSize: blob.size,
                duration: 0,
                fileName: `${baseName}.${extMap[outputFormat]}`,
                blob,
                originalUrl,
                convertedUrl: URL.createObjectURL(blob),
              });
            },
            mimeType,
            outputFormat !== "png" ? quality : undefined
          );
        };

        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error(`无法加载: ${file.name}`));
        };

        img.src = url;
      });
    },
    [outputFormat, quality]
  );

  const startConvert = useCallback(async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setProgress(0);
    setError(null);
    const allResults: ConvertResult[] = [];
    const startTime = Date.now();

    try {
      for (let i = 0; i < files.length; i++) {
        const result = await convertImage(files[i].file, originalUrls[i]);
        result.duration = Date.now() - startTime;
        allResults.push(result);
        setProgress(((i + 1) / files.length) * 100);
      }
      setResults(allResults);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "转换失败");
      setStatus("error");
    }
  }, [files, originalUrls, convertImage]);

  const downloadAll = useCallback(() => {
    results.forEach((r) => downloadBlob(r.blob, r.fileName));
  }, [results]);

  const reset = useCallback(() => {
    setFiles([]);
    setResults([]);
    setStatus("idle");
    setProgress(0);
    setError(null);
    setExpandedIndex(null);
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
      icon="🔄"
      title="图片格式转换"
      description="JPG/PNG/WebP格式互转，支持批量处理"
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
            <h3 className="font-medium text-gray-900 mb-2">已选文件 ({files.length})</h3>
            <div className="space-y-1 max-h-48 overflow-y-auto">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">目标格式</label>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { value: "jpeg" as const, label: "JPG", desc: "体积小，兼容好" },
                  { value: "png" as const, label: "PNG", desc: "无损，支持透明" },
                  { value: "webp" as const, label: "WebP", desc: "新一代格式" },
                ]).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setOutputFormat(opt.value)}
                    className={`p-3 rounded-lg border-2 text-center transition-colors ${
                      outputFormat === opt.value
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

            {outputFormat !== "png" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  输出质量: {Math.round(quality * 100)}%
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
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={startConvert}
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

      {status === "done" && results.length >= 1 && (
        <div className="space-y-4">
          {results.map((r, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 text-sm truncate">{r.fileName}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-sm">
                  <span className="text-gray-400">{formatFileSize(r.originalSize)}</span>
                  <span className="text-gray-400">→</span>
                  <span className="text-green-600 font-medium">{formatFileSize(r.compressedSize)}</span>
                  <button
                    onClick={() => downloadBlob(r.blob, r.fileName)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    下载
                  </button>
                </div>
              </div>

              <ImageCompareSlider
                originalUrl={r.originalUrl}
                compressedUrl={r.convertedUrl}
                originalLabel={`原图 ${formatFileSize(r.originalSize)}`}
                compressedLabel={`转换后 ${formatFileSize(r.compressedSize)}`}
              />
            </div>
          ))}
        </div>
      )}
    </ToolPageLayout>
  );
}
