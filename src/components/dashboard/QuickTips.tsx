import { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { MonthlyStats } from '@/types/dashboard';

interface QuickTipsProps {
  monthlyStats?: MonthlyStats;
}

/**
 * Enhanced Quick tips component displayed at the bottom of the dashboard
 */
export default function QuickTips({ monthlyStats }: QuickTipsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Generate insights based on the data
  const generateInsights = () => {
    if (!monthlyStats) return [];

    const insights = [];

    // Only include important, actionable insights

    // Insight about overtime
    if (monthlyStats.overtimeHours > 0) {
      const overtimePercentage = (monthlyStats.overtimeHours / monthlyStats.totalHours) * 100;
      if (overtimePercentage > 20) {
        insights.push({
          id: 'high-overtime',
          title: 'Overtime Analysis',
          tip:
            'Your overtime is at ' +
            overtimePercentage.toFixed(1) +
            '% of total hours. Consider adjusting your schedule or negotiating rates.',
        });
      }
    }

    // Insight about earning potential
    const avgHourlyRate =
      monthlyStats.totalHours > 0 ? monthlyStats.totalEarnings / monthlyStats.totalHours : 0;

    if (avgHourlyRate < 50) {
      insights.push({
        id: 'rate-optimization',
        title: 'Income Optimization',
        tip:
          'Your average hourly rate is ₪' +
          avgHourlyRate.toFixed(2) +
          '. Focus on employers or shifts with higher rates.',
      });
    }

    // Tax planning insight (always include this one)
    insights.push({
      id: 'tax-planning',
      title: 'Tax Planning',
      tip: 'Income tax in Israel ranges from 10% to 50% depending on income level. For 2025, annual income up to ₪84,120 is taxed at 10%. See the tax chart below for all brackets.',
    });

    return insights;
  };

  const insights = generateInsights();

  // If there are no insights, don't render the component
  if (insights.length === 0) return null;

  return (
    <div className="mt-8 bg-gray-800/20 backdrop-blur-sm border border-gray-700/20 rounded-lg p-5 max-w-6xl mx-auto hover:bg-gray-800/30 transition-all duration-300">
      <div
        className="flex items-center justify-between cursor-pointer pb-2 border-b border-gray-700/20"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-base font-medium text-gray-100">Insights</h3>
        <button className="text-gray-400 hover:text-white">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {!isExpanded && (
        <p className="text-gray-400 text-xs mt-3">
          {insights[0].tip} <span className="text-blue-400">(click to view more)</span>
        </p>
      )}

      {isExpanded && (
        <div className="mt-3 space-y-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="border-l-2 pl-3"
              style={{
                borderColor:
                  insight.id === 'high-overtime'
                    ? '#FBBF24'
                    : insight.id === 'rate-optimization'
                    ? '#10B981'
                    : '#3B82F6',
              }}
            >
              <h4 className="text-sm font-medium text-gray-100">{insight.title}</h4>
              <p className="text-gray-400 text-xs mt-0.5">{insight.tip}</p>
            </div>
          ))}

          <div className="flex pt-2">
            <a
              href="/settings"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors"
            >
              Configure settings
              <ArrowRight className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
