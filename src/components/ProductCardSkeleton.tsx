export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden w-full max-w-sm animate-pulse">
      {/* Image Skeleton */}
      <div className="h-50 w-full bg-gray-200"></div>

      {/* Content Section */}
      <div className="flex flex-col p-4 h-50">
        {/* Title and Description Skeleton */}
        <div className="flex flex-col gap-2 flex-grow">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>

        {/* Bottom Section - Stock and Edit Button Skeleton */}
        <div className="flex items-end justify-between mt-6">
          {/* Stock Input Skeleton */}
          <div className="flex flex-col space-y-2">
            <div className="h-4 bg-gray-200 rounded w-12"></div>
            <div className="h-10 bg-gray-200 rounded w-20"></div>
          </div>

          {/* Edit Button Skeleton */}
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
