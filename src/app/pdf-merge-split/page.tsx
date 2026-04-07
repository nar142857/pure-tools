"use client";

import { useState, useCallback } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { FileDropZone } from "@/components/FileDropZone";
import { ProcessingStatus, ProcessStatus } from "@/components/ProcessingStatus";
import { SinglePreview } from "@/components/ImageCompareSlider";
import { downloadBlob, formatFileSize } from "@/lib/tools";
import { PDFDocument } from "pdf-lib";

type Mode = "merge" | "split";

interface PagePreview {
  fileName: string;
  blob: Blob;
  previewUrl: string;
  pageNum: number;
}

export default function PdfMergeSplitPage() {
  const [mode, setMode] = useState<Mode>("merge");
  const [files, setFiles] = useState<{ file: File; id: string }[]>([]);
  const [status, setStatus] = useState<ProcessStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<PagePreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandedPage, setExpandedPage] = useState<number | null>(null);

  const handleFiles = useCallback(
    (newFiles: { file: File; id: string }[]) => {
      if (mode === "split") {
        setFiles([newFiles[0]]);
      } else {
        setFiles(newFiles);
      }
      setResults([]);
      setStatus("idle");
      setError(null);
      setExpandedPage(null);
    },
    [mode]
  );

  const renderPdfPreview = async (pdfBytes: Uint8Array, pageNum: number): Promise<string> => {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
    const page = await pdf.getPage(pageNum);
    const vp = page.getViewport({ scale: 1.2 });
    const canvas = document.createElement("canvas");
    canvas.width = vp.width;
    canvas.height = vp.height;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport: vp }).promise;
    return canvas.toDataURL("image/jpeg", 0.7);
  };

  const mergePdfs = useCallback(async () => {
    if (files.length < 2) {
      setError("合并至少需要2个PDF文件");
      return;
    }

    setStatus("processing");
    setProgress(10);

    try {
      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {
        const arrayBuffer = await files[i].file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
        setProgress(((i + 1) / files.length) * 60);
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });

      setProgress(70);
      const previewUrl = await renderPdfPreview(new Uint8Array(pdfBytes), 1);

      setResults([{ blob, fileName: "merged.pdf", previewUrl, pageNum: 1 }]);
      setProgress(100);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "合并失败");
      setStatus("error");
    }
  }, [files]);

  const splitPdf = useCallback(async () => {
    if (files.length !== 1) return;

    setStatus("processing");
    setProgress(10);

    try {
      const arrayBuffer = await files[0].file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const totalPages = pdfDoc.getPageIndices();
      const baseName = files[0].file.name.replace(/\.pdf$/i, "");
      const splitResults: PagePreview[] = [];

      for (let i = 0; i < totalPages.length; i++) {
        const newPdf = await PDFDocument.create();
        const [page] = await newPdf.copyPages(pdfDoc, [i]);
        newPdf.addPage(page);
        const pdfBytes = await newPdf.save();
        const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });

        let previewUrl = "";
        if (i < 20) {
          try {
            previewUrl = await renderPdfPreview(new Uint8Array(pdfBytes), 1);
          } catch {
            previewUrl = "";
          }
        }

        splitResults.push({ blob, fileName: `${baseName}_page${i + 1}.pdf`, previewUrl, pageNum: i + 1 });
        setProgress(((i + 1) / totalPages.length) * 85);
      }

      setResults(splitResults);
      setProgress(100);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "拆分失败");
      setStatus("error");
    }
  }, [files]);

  const startProcess = useCallback(() => {
    if (mode === "merge") {
      mergePdfs();
    } else {
      splitPdf();
    }
  }, [mode, mergePdfs, splitPdf]);

  const downloadAll = useCallback(() => {
    results.forEach((r) => downloadBlob(r.blob, r.fileName));
  }, [results]);

  const reset = useCallback(() => {
    setFiles([]);
    setResults([]);
    setStatus("idle");
    setProgress(0);
    setError(null);
    setExpandedPage(null);
  }, []);

  const mainResult = results.length > 0
    ? {
        originalSize: files.reduce((s, f) => s + f.file.size, 0),
        compressedSize: results.reduce((s, r) => s + r.blob.size, 0),
        duration: 0,
        fileName: results.length === 1 ? results[0].fileName : `${results.length} 个文件`,
        blob: results[0].blob,
      }
    : undefined;

  return (
    <ToolPageLayout
      icon="✂️"
      title="PDF合并/拆分"
      description="合并多个PDF为一个，或将PDF拆分为单页"
    >
      {files.length === 0 && (
        <>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">操作模式</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode("merge")}
                className={`p-4 rounded-lg border-2 text-center transition-colors ${
                  mode === "merge" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-1">📑</div>
                <div className="font-medium">合并</div>
                <div className="text-xs text-gray-400">多个PDF合并为一个</div>
              </button>
              <button
                onClick={() => setMode("split")}
                className={`p-4 rounded-lg border-2 text-center transition-colors ${
                  mode === "split" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-1">✂️</div>
                <div className="font-medium">拆分</div>
                <div className="text-xs text-gray-400">PDF拆分为单页</div>
              </button>
            </div>
          </div>

          <FileDropZone
            accept=".pdf,application/pdf"
            multiple={mode === "merge"}
            onFiles={handleFiles}
            description={mode === "merge" ? "选择多个PDF文件" : "选择一个PDF文件"}
          />
        </>
      )}

      {files.length > 0 && status === "idle" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-2">
              {mode === "merge" ? `待合并文件 (${files.length})` : "待拆分文件"}
            </h3>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {files.map((f, i) => (
                <div key={f.id} className="flex items-center justify-between text-sm py-1">
                  <span className="text-gray-700 truncate">
                    {i + 1}. {f.file.name}
                  </span>
                  <span className="text-gray-400 ml-2 shrink-0">{formatFileSize(f.file.size)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={startProcess}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {mode === "merge" ? "开始合并" : "开始拆分"}
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

      {status === "done" && mode === "merge" && results.length === 1 && results[0].previewUrl && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <h3 className="font-medium text-gray-900">合并结果预览（首页）</h3>
          <SinglePreview imageUrl={results[0].previewUrl} label="合并后的PDF" />
        </div>
      )}

      {status === "done" && mode === "split" && results.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">
              拆分结果 ({results.length} 页)
            </h3>
            <button
              onClick={downloadAll}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              全部下载
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {results.map((r) => (
              <div
                key={r.pageNum}
                className="group relative border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-blue-400 hover:shadow-md transition-all"
                onClick={() => setExpandedPage(r.pageNum)}
              >
                <div className="aspect-[3/4] bg-gray-50 flex items-center justify-center overflow-hidden">
                  {r.previewUrl ? (
                    <img src={r.previewUrl} alt={`第 ${r.pageNum} 页`} className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-gray-300 text-3xl">📄</div>
                  )}
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
            const r = results.find((x) => x.pageNum === expandedPage);
            if (!r || !r.previewUrl) return null;
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
