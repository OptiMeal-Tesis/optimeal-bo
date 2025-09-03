interface MealCardProps {
    image: string;
    delivered: number;
    total: number;
    name: string;
}

export default function MealCard({ image, delivered, total, name }: MealCardProps) {
    return (
        <div className="bg-white rounded-2xl border-2 border-primary-700 shadow-xl p-4 w-1/3">
            <div className="flex items-center gap-3">

                {/* Left Section - Image */}
                <div className="flex-shrink-0">
                    <img
                        src={image}
                        className="w-20 h-20 rounded-lg object-cover"
                    />
                </div>

                {/* Right Section - Text Content */}
                <div className="flex flex-col justify-between min-h-20 flex-1 min-w-0">

                    {/* Top Line - Delivery Status */}
                    <div className="text-sub1 text-primary-500 leading-tight">
                        <span>Por entregar: </span>
                        <span className="font-bold">
                            {delivered}
                        </span>
                        <span>/{total}</span>
                    </div>

                    {/* Bottom Line - Meal Name */}
                    <div className="text-sub1 text-gray-400 leading-tight break-words">
                        {name}
                    </div>
                </div>
            </div>
        </div>
    );
}
