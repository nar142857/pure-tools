"use client";

import { formatFileSize } from "@/lib/tools";

export type ProcessStatus = "idle" | "processing" | "done" | "error";

interface ProcessingStatusProps {
  status: ProcessStatus;
  progress: number;
  result?: {
    originalSize: number;
    compressedSize?: number;
    duration: number;
    fileName: string;
    blob: Blob;
  };
  error?: string;
  onDownload?: () => void;
  onReset?: () => void;
}

export function ProcessingStatus({
  status,
  progress,
  result,
  error,
  onDownload,
  onReset,
}: ProcessingStatusProps) {
  if (status === "idle") return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      {status === "processing" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">处理中...</span>
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="progress-bar bg-blue-600 h-full rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {status === "done" && result && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-green-600">
            <span className="text-2xl">✅</span>
            <span className="font-semibold">处理完成！</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500">原始大小</div>
              <div className="font-semibold">{formatFileSize(result.originalSize)}</div>
            </div>
            {result.compressedSize !== undefined && (
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500">处理后大小</div>
                <div className="font-semibold">
                  {formatFileSize(result.compressedSize)}
                  <span className="ml-2 text-sm text-green-600">
                    -{Math.round((1 - result.compressedSize / result.originalSize) * 100)}%
                  </span>
                </div>
              </div>
            )}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500">处理耗时</div>
              <div className="font-semibold">{(result.duration / 1000).toFixed(1)}s</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500">输出文件</div>
              <div className="font-semibold text-sm truncate">{result.fileName}</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onDownload}
              className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              ⬇️ 下载文件
            </button>
            <button
              onClick={onReset}
              className="py-3 px-6 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              重新处理
            </button>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-red-600">
            <span className="text-2xl">❌</span>
            <span className="font-semibold">处理失败</span>
          </div>
          <p className="text-sm text-red-500">{error || "未知错误，请重试"}</p>
          <button
            onClick={onReset}
            className="py-2 px-4 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            重新尝试
          </button>
        </div>
      )}
    </div>
  );
}
