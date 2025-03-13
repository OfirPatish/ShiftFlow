/**
 * Quick tips component displayed at the bottom of the dashboard
 */
export default function QuickTips() {
  return (
    <div className="mt-10 bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-lg p-6 max-w-6xl mx-auto hover:bg-gray-800/40 transition-all duration-300">
      <div className="flex items-center mb-4">
        <div className="bg-blue-500/20 p-2 rounded-full mr-3 animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-100">Quick Tips</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <p className="text-gray-400 text-sm">
          Visit the <span className="text-primary">shifts page</span> to add or edit your work
          shifts. Track your earnings and hours worked efficiently with ShiftFlow.
        </p>
        <p className="text-gray-400 text-sm">
          Set up <span className="text-green-400">overtime rules</span> for each employer to
          automatically calculate extra pay for hours worked beyond your regular schedule.
        </p>
      </div>
    </div>
  );
}
