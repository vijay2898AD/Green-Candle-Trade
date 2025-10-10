// src/components/StockCardSkeleton.tsx

export const StockCardSkeleton = () => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg animate-pulse">
      {/* Symbol and Price Placeholders */}
      <div className="flex justify-between items-center mb-2">
        <div className="h-6 bg-gray-700 rounded w-1/3"></div>
        <div className="h-6 bg-gray-700 rounded w-1/4"></div>
      </div>
      {/* Name Placeholder */}
      <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
      {/* Button Placeholder */}
      <div className="h-10 bg-gray-700 rounded mt-4"></div>
    </div>
  );
};