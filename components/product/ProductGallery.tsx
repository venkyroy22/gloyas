'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const MotionImage = motion(Image);

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZooming) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const goTo = useCallback((index: number) => {
    setDirection(index > selectedIndex ? 1 : -1);
    setSelectedIndex(index);
  }, [selectedIndex]);

  const nextImage = useCallback(() => {
    setDirection(1);
    setSelectedIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setDirection(-1);
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Swipe handler for touch devices
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      nextImage();
    } else if (info.offset.x > threshold) {
      prevImage();
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Main Image Container */}
      <div className="relative group" ref={containerRef}>
        <div
          className={`relative aspect-square overflow-hidden bg-[#F9F9F9] border border-[#E8E8E8] ${
            isZooming ? 'cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onDoubleClick={() => setIsZooming(!isZooming)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleMouseMove}
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <MotionImage
              key={selectedIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.15 },
              }}
              src={images[selectedIndex]}
              alt={`${name} - View ${selectedIndex + 1}`}
              fill
              className="object-cover touch-pan-y"
              style={
                isZooming
                  ? {
                      transform: 'scale(2)',
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    }
                  : {}
              }
              drag={!isZooming ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={handleDragEnd}
              draggable={false}
              priority={selectedIndex === 0}
            />
          </AnimatePresence>
        </div>

        {/* Navigation Arrows — hidden on mobile (swipe instead) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 hidden sm:flex items-center justify-center bg-white/80 backdrop-blur-sm border border-[#E8E8E8] text-[#111111] transition-all duration-200 hover:bg-white hover:scale-110 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 hidden sm:flex items-center justify-center bg-white/80 backdrop-blur-sm border border-[#E8E8E8] text-[#111111] transition-all duration-200 hover:bg-white hover:scale-110 z-10"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Mobile swipe indicator dots */}
      {images.length > 1 && (
        <div className="flex sm:hidden justify-center gap-1.5 py-1">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`View image ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                selectedIndex === i
                  ? 'w-6 bg-[#0080FF]'
                  : 'w-1.5 bg-[#D1D5DB]'
              }`}
            />
          ))}
        </div>
      )}

      {/* Thumbnails — desktop only */}
      <div className="hidden sm:flex gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            aria-label={`View image ${i + 1}`}
            onClick={() => goTo(i)}
            className={`w-16 h-16 overflow-hidden transition-all duration-200 ${
              selectedIndex === i
                ? 'border-2 border-[#0080FF] opacity-100'
                : 'border border-[#E8E8E8] opacity-60 hover:opacity-100'
            }`}
          >
            <div className="relative w-full h-full">
              <Image
                src={img}
                alt={`${name} thumbnail ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
