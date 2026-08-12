'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const mainImage = images[0] || 'https://cdn.streamlet.in/69e90aee72e67a6c3dc22477/images/baseballcap-1776881129562.webp';
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image rounded frame */}
      <div 
        className={`relative aspect-[3/4] overflow-hidden bg-white border-2 border-black rounded-[32px] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] ${
          zoom ? 'cursor-zoom-out' : 'cursor-zoom-in'
        }`}
        onDoubleClick={() => setZoom(!zoom)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setZoom(false)}
      >
        <Image
          src={mainImage}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          className="object-contain p-8 transition-transform duration-200"
          style={
            zoom 
              ? {
                  transform: 'scale(1.8)',
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                }
              : {}
          }
          priority
        />
      </div>

      <div className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest mt-1">
        Double click image to zoom
      </div>
    </div>
  );
}
