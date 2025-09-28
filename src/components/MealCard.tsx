import { useState } from "react";

interface MealCardProps {
  image: string;
  remainingToPrepare: number;
  total: number;
  name: string;
}

export default function MealCard({
  image,
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
            <div className="absolute inset-0 rounded-lg bg-gray-200 animate-pulse" />
          )}
          
          <img
            src={image}
            alt={name}
            onLoad={() => setLoaded(true)}
            className={`w-20 h-20 rounded-lg object-cover transition-opacity duration-300 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* Right Section - Text Content */}
        <div className="flex flex-col justify-between min-h-20 min-w-0 flex-1">
          {/* Top Line - Delivery Status */}
          <div className="text-sub1 text-primary-500 leading-tight mb-2">
            <span>Por entregar: </span>
            <span className="font-bold">{remainingToPrepare}</span>
            <span>/{total}</span>
          </div>

          {/* Bottom Line - Meal Name */}
          <div className="text-body1 text-gray-400 leading-relaxed">{name}</div>
        </div>
      </div>
    </div>
  );
}
