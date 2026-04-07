"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface ImageCompareSliderProps {
  originalUrl: string;
  compressedUrl: string;
  originalLabel?: string;
  compressedLabel?: string;
}

export function ImageCompareSlider({
  originalUrl,
  compressedUrl,
  originalLabel = "原图",
  compressedLabel = "压缩后",
}: ImageCompareSliderProps) {
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setDragging(true);
    updatePosition(e.touches[0].clientX);
  }, [updatePosition]);

  useEffect(() => {
    if (!dragging) return;

    const onMouseMove = (e: MouseEvent) => updatePosition(e.clientX);
    const onMouseUp = () => setDragging(false);
    const onTouchMove = (e: TouchEvent) => updatePosition(e.touches[0].clientX);
    const onTouchEnd = () => setDragging(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [dragging, updatePosition]);

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none overflow-hidden rounded-lg border border-gray-200 cursor-col-resize"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <img
        src={compressedUrl}
        alt={compressedLabel}
        className="w-full h-auto block"
        draggable={false}
      />

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img
          src={originalUrl}
          alt={originalLabel}
          className="w-full h-auto block"
          style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : "100%" }}
          draggable={false}
        />
      </div>

      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 8L2 6M4 8L2 10M4 8H12M12 8L14 6M12 8L14 10" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
        {originalLabel}
      </div>
      <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
        {compressedLabel}
      </div>
    </div>
  );
}

interface SinglePreviewProps {
  imageUrl: string;
  label?: string;
}

export function SinglePreview({ imageUrl, label = "预览" }: SinglePreviewProps) {
  return (
    <div className="relative rounded-lg border border-gray-200 overflow-hidden">
      <img
        src={imageUrl}
        alt={label}
        className="w-full h-auto block max-h-96 object-contain bg-gray-50"
      />
      <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
        {label}
      </div>
    </div>
  );
}
