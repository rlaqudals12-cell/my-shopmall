"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductImageGalleryProps {
  product: Product;
}

export function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    product.image_url || null
  );

  // Placeholder 이미지 URL
  const placeholderImage = "https://via.placeholder.com/800x800?text=No+Image";
  const mainImage = selectedImage || placeholderImage;

  // 이미지가 하나만 있는 경우에도 갤러리 형태로 표시
  const images = product.image_url ? [product.image_url] : [];

  return (
    <div className="space-y-4">
      {/* 메인 이미지 */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <Skeleton className="h-full w-full" />
        )}
      </div>

      {/* 썸네일 이미지 목록 (이미지가 여러 개일 경우) */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                selectedImage === image
                  ? "border-primary"
                  : "border-transparent hover:border-primary/50"
              }`}
            >
              <Image
                src={image}
                alt={`${product.name} - 이미지 ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 10vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

