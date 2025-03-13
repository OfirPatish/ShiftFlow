import Link from 'next/link';

/**
 * Welcome tutorial component shown to new users when they have no shifts
 */
export default function DashboardTutorial() {
  return (
    <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/30 p-8">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-100">Welcome to ShiftFlow!</h2>
        <p className="text-gray-400 text-sm">
          You haven&apos;t tracked any shifts yet. Let&apos;s get you started with your shift
          tracking journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800/60 rounded-lg p-5 border border-gray-700/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full"></div>
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold mb-3">
            1
          </span>
          <h3 className="text-lg font-medium text-white mb-2">Create an Employer</h3>
          <p className="text-gray-400 text-sm">
            Start by adding an employer. This will allow you to organize shifts by workplace.
          </p>
        </div>

        <div className="bg-gray-800/60 rounded-lg p-5 border border-gray-700/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-bl-full"></div>
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold mb-3">
            2
          </span>
          <h3 className="text-lg font-medium text-white mb-2">Set Up Pay Rates</h3>
          <p className="text-gray-400 text-sm">
            Configure your hourly rates, including overtime rates to accurately calculate earnings.
          </p>
        </div>

        <div className="bg-gray-800/60 rounded-lg p-5 border border-gray-700/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-bl-full"></div>
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 text-green-400 font-bold mb-3">
            3
          </span>
          <h3 className="text-lg font-medium text-white mb-2">Add Your Shifts</h3>
          <p className="text-gray-400 text-sm">
            Record your work shifts with start/end times. Your earnings will be calculated
            automatically.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/employers"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          Add Employer
        </Link>
        <Link
          href="/shifts"
          className="inline-flex items-center px-4 py-2 border border-gray-700/50 text-sm font-medium rounded-md text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          Add Shift
        </Link>
      </div>
    </div>
  );
}
