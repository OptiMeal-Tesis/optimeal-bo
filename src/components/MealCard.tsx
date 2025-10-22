import { useState } from "react";
import ImagePlaceholder from "../assets/images/image-placeholder.jpg";

interface MealCardProps {
  image: string;
  preparedQuantity: number;
  remainingToPrepare: number;
  total: number;
  name: string;
}

export default function MealCard({
  image,
  preparedQuantity,
  remainingToPrepare,
  total,
  name,
}: MealCardProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border-2 border-primary-500 p-3 w-full">
      <div className="flex items-center gap-3">
        {/* Left Section - Image */}
        <div className="flex-shrink-0 relative w-20 h-20">
          {/* Skeleton */}
          {!loaded && (
            <div className="absolute inset-0 rounded-xl bg-gray-200 animate-pulse" />
          )}
          
          <img
            src={image || ImagePlaceholder }
            alt={name}
            onLoad={() => setLoaded(true)}
            className={`w-20 h-20 rounded-xl object-cover transition-opacity duration-300 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* Right Section - Text Content */}
        <div className="flex flex-col justify-between min-h-20 min-w-0 flex-1">
          {/* Top Line - Delivery Status */}
          <div className="flex flex-col gap-0.5">
            <div className="text-sub1 text-primary-500 leading-tight">
              <span>Entregado: </span>
              <span>{preparedQuantity}</span>
              <span>/{total}</span>
            </div>
            <div className="text-sub1 text-primary-500 leading-tight mb-2">
              <span>Por entregar: </span>
              <span className="font-bold">{remainingToPrepare}</span>
            </div>
          </div>

          {/* Bottom Line - Meal Name */}
          <div className="text-body1 text-gray-600 leading-relaxed">{name}</div>
        </div>
      </div>
    </div>
  );
}
