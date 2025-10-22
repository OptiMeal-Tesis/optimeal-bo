import { useGetShiftSummary } from "../hooks/useShiftSummary";
import MealCard from "./MealCard";
import SideCard from "./SideCard";

interface ShiftSummaryProps {
  selectedShift: string;
}

export default function ShiftSummary({ selectedShift }: ShiftSummaryProps) {
  const {
    data: shiftSummaryResponse,
    isLoading,
    error,
  } = useGetShiftSummary(selectedShift);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-red-600 text-sm">
          Error al cargar el resumen del turno
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Main Dishes Skeleton */}
        <div className="flex flex-col gap-2">
          <span className="text-sub1 text-primary-500">Platos principales</span>
          <div className="flex flex-row gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-4 w-1/3 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 bg-gray-300 rounded-xl"></div>
                  <div className="flex flex-col justify-between min-h-20 flex-1 min-w-0">
                    <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sides Skeleton */}
        <div className="flex flex-col gap-2">
          <span className="text-sub1 text-primary-500">Guarniciones</span>
          <div className="flex flex-row gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-200 shadow-lg p-4 w-1/6 animate-pulse"
              >
                <div className="flex flex-col justify-between min-h-16">
                  <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const shiftData = shiftSummaryResponse?.data;

  if (!shiftData) {
    return (
      <div className="bg-gray-50 p-4 rounded-xl">
        <p className="text-sm text-gray-500 italic">
          No hay datos disponibles para este turno
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Dishes */}
      {shiftData.mainDishes.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sub1 text-primary-500">Platos principales</span>
          <div className="grid grid-cols-3 gap-4 w-full">
            {shiftData.mainDishes.map((dish) => (
              <MealCard
                key={dish.id}
                image={dish.photo}  
                preparedQuantity={dish.preparedQuantity}
                remainingToPrepare={dish.remainingToPrepare}
                total={dish.totalToPrepare}
                name={dish.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sides */}
      {shiftData.sides.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sub1 text-primary-500">Guarniciones</span>
          <div className="flex flex-wrap gap-4">
            {shiftData.sides.map((side) => (
              <SideCard
                key={side.id}
                delivered={side.preparedQuantity}
                total={side.totalToPrepare}
                name={side.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {shiftData.mainDishes.length === 0 && shiftData.sides.length === 0 && (
        <div className="bg-gray-50 p-4 rounded-xl">
          <p className="text-sm text-gray-500 italic">
            No hay platos para preparar en este turno
          </p>
        </div>
      )}
    </div>
  );
}
