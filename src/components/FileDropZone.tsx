"use client";

import { useCallback, useState, useRef } from "react";
import { formatFileSize } from "@/lib/tools";

interface FileInfo {
  file: File;
  id: string;
}

interface FileDropZoneProps {
  accept: string;
  multiple?: boolean;
  maxSize?: number;
  onFiles: (files: FileInfo[]) => void;
  description?: string;
}

export function FileDropZone({
  accept,
  multiple = false,
  maxSize = 100 * 1024 * 1024,
  onFiles,
  description,
}: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      setError(null);

      const acceptedExts = accept.split(",").map((s) => s.trim().toLowerCase());
      const files: FileInfo[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (file.size > maxSize) {
          setError(`文件 "${file.name}" 超过大小限制 ${formatFileSize(maxSize)}`);
          return;
        }
        const ext = "." + file.name.split(".").pop()?.toLowerCase();
        const mimeMatch = acceptedExts.some(
          (a) =>
            a === ext ||
            file.type.match(new RegExp(a.replace("*", ".*").replace("/", "\\/")))
        );
        if (!mimeMatch) {
          setError(`文件 "${file.name}" 格式不支持，请上传 ${accept} 格式的文件`);
          return;
        }
        files.push({ file, id: crypto.randomUUID() });
      }

      if (!multiple && files.length > 1) {
        setError("请只选择一个文件");
        return;
      }

      onFiles(files);
    },
    [accept, maxSize, multiple, onFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleClick = () => inputRef.current?.click();

  return (
    <div>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative cursor-pointer border-2 border-dashed rounded-xl p-12 text-center
          transition-all duration-200
          ${isDragging ? "drop-zone-active" : "border-gray-300 hover:border-blue-400 bg-white"}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => processFiles(e.target.files)}
          className="hidden"
        />
        <div className="text-5xl mb-4">
          {isDragging ? "📥" : "📁"}
        </div>
        <p className="text-lg font-medium text-gray-700 mb-1">
          {isDragging ? "松开鼠标即可上传" : "拖拽文件到这里，或点击选择文件"}
        </p>
        <p className="text-sm text-gray-400">
          {description || `支持 ${accept} 格式`}
        </p>
        <div className="mt-3 flex items-center justify-center gap-1 text-xs text-green-600">
          <span>🔒</span>
          <span>文件仅在本地处理，不会上传到任何服务器</span>
        </div>
      </div>
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}
