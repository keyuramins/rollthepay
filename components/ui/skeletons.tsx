// components/ui/skeletons.tsx
// Minimal skeleton to match only the occupation list visual layout

export function OccupationListSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
      <ul className="grid grid-cols-1 gap-4" role="list">
        {Array.from({ length: 8 }).map((_, i) => (
          <li
            key={i}
            className="bg-white rounded-lg border border-input py-3 px-4 sm:py-2 sm:px-6 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
              <div className="mt-2 sm:mt-0 sm:ml-6 h-5 bg-gray-200 rounded w-24"></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
