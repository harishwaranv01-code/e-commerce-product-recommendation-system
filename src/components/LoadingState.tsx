export function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-96 bg-gray-800 rounded-2xl animate-pulse overflow-hidden"
        >
          <div className="h-64 bg-gray-900" />
          <div className="p-6 space-y-4">
            <div className="h-6 bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-2/3" />
            <div className="flex justify-between items-center mt-6">
              <div className="h-8 bg-gray-700 rounded w-1/3" />
              <div className="h-10 bg-gray-700 rounded-xl w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
