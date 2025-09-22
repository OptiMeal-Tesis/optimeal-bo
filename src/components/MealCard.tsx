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
  return (
    <div className="bg-white rounded-2xl border-2 border-primary-500 p-3 w-full">
      <div className="flex items-center gap-3">
        {/* Left Section - Image */}
        <div className="flex-shrink-0">
          <img src={image} className="w-20 h-20 rounded-lg object-cover" />
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
