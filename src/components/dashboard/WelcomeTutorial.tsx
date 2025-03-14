import Link from 'next/link';
import { ArrowRight, Briefcase, Clock, CreditCard } from 'lucide-react';

/**
 * Welcome tutorial component shown to new users when they have no shifts
 */
export default function WelcomeTutorial() {
  return (
    <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/30 p-8 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/30 to-blue-500/30 rounded-full mb-4">
          <Clock className="h-10 w-10 text-white/80" />
        </div>
        <h2 className="text-2xl font-semibold mb-3 text-white">Welcome to ShiftFlow!</h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Your journey to effortless shift tracking begins here. Follow these simple steps to get
          started and gain insights into your work hours and earnings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/60 rounded-xl p-6 border border-gray-700/50 relative overflow-hidden group hover:bg-gray-800/80 transition-all duration-300 hover:border-primary/50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full transform group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary-light font-bold">
              1
            </span>
            <Briefcase className="w-5 h-5 text-primary-light" />
          </div>
          <h3 className="text-lg font-medium text-white mb-3">Create an Employer</h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Add your workplace details and customize with a color code for easy identification. Each
            employer can have unique settings.
          </p>
          <Link
            href="/employers"
            className="text-primary-light hover:text-primary text-sm flex items-center group-hover:underline"
          >
            Add employers <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>

        <div className="bg-gray-800/60 rounded-xl p-6 border border-gray-700/50 relative overflow-hidden group hover:bg-gray-800/80 transition-all duration-300 hover:border-blue-500/50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full transform group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 font-bold">
              2
            </span>
            <CreditCard className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-3">Set Up Pay Rates</h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Configure your hourly rates, including overtime thresholds and multipliers to ensure
            accurate earnings calculations.
          </p>
          <Link
            href="/rates"
            className="text-blue-400 hover:text-blue-300 text-sm flex items-center group-hover:underline"
          >
            Configure rates <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>

        <div className="bg-gray-800/60 rounded-xl p-6 border border-gray-700/50 relative overflow-hidden group hover:bg-gray-800/80 transition-all duration-300 hover:border-green-500/50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-bl-full transform group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20 text-green-400 font-bold">
              3
            </span>
            <Clock className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-3">Add Your Shifts</h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Record your work shifts with precise start/end times. Track regular and overtime hours
            automatically with our smart calculator.
          </p>
          <Link
            href="/shifts"
            className="text-green-400 hover:text-green-300 text-sm flex items-center group-hover:underline"
          >
            Track shifts <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
