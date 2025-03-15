import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  TooltipProps,
} from 'recharts';
import { getCurrencySymbol } from '@/lib/utils/currencyFormatter';

// Tax bracket structure based on 2025 data for Israel - MONTHLY values (yearly values divided by 12)
const TAX_BRACKETS_2025_MONTHLY = [
  {
    bracket: 1,
    min: 0,
    max: 7010,
    rate: 10,
    label: '₪0 - ₪7,010',
    color: '#4ADE80', // light green
  },
  {
    bracket: 2,
    min: 7011,
    max: 10060,
    rate: 14,
    label: '₪7,011 - ₪10,060',
    color: '#22C55E', // green
  },
  {
    bracket: 3,
    min: 10061,
    max: 16150,
    rate: 20,
    label: '₪10,061 - ₪16,150',
    color: '#10B981', // emerald
  },
  {
    bracket: 4,
    min: 16151,
    max: 22440,
    rate: 31,
    label: '₪16,151 - ₪22,440',
    color: '#0EA5E9', // sky blue
  },
  {
    bracket: 5,
    min: 22441,
    max: 46690,
    rate: 35,
    label: '₪22,441 - ₪46,690',
    color: '#8B5CF6', // violet
  },
  {
    bracket: 6,
    min: 46691,
    max: 60130,
    rate: 47,
    label: '₪46,691 - ₪60,130',
    color: '#C084FC', // purple
  },
  {
    bracket: 7,
    min: 60131,
    max: Infinity,
    rate: 50,
    label: '₪60,131+',
    color: '#F472B6', // pink
  },
];

interface TaxBracketChartProps {
  monthlyIncome: number;
}

/**
 * Tax bracket visualization component for Israeli income tax 2025 - Monthly Brackets
 */
export default function TaxBracketChart({ monthlyIncome }: TaxBracketChartProps) {
  // Use monthly income directly (no need to annualize)
  const income = monthlyIncome || 0;

  // Calculate the current tax bracket based on monthly income
  const getCurrentBracket = () => {
    if (!income) return null;

    for (const bracket of TAX_BRACKETS_2025_MONTHLY) {
      if (income >= bracket.min && income <= bracket.max) {
        return bracket.bracket;
      }
    }

    // If income is above the last bracket's max
    if (income > TAX_BRACKETS_2025_MONTHLY[TAX_BRACKETS_2025_MONTHLY.length - 1].min) {
      return TAX_BRACKETS_2025_MONTHLY.length;
    }

    return null;
  };

  const currentBracket = getCurrentBracket();

  // Custom tooltip for the tax chart
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700/30 rounded-md p-2 shadow-md">
          <p className="font-medium text-white text-sm">Tax Bracket {data.bracket}</p>
          <p className="text-gray-300 text-xs">
            <span className="text-gray-400">Income Range:</span> {data.label}
          </p>
          <p className="text-gray-300 text-xs">
            <span className="text-gray-400">Tax Rate:</span> {data.rate}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate the tax for the given income and append to display data
  const chartData = TAX_BRACKETS_2025_MONTHLY.map((bracket) => ({
    ...bracket,
    isCurrentBracket: bracket.bracket === currentBracket,
  }));

  return (
    <>
      <div className="flex items-center justify-between pb-2 border-b border-gray-700/20">
        <h3 className="text-base font-medium text-gray-100">2025 Israel Tax Brackets (Monthly)</h3>
        {income > 0 && (
          <div className="text-xs text-gray-400">
            Monthly Income:{' '}
            <span className="text-white font-medium">
              {getCurrencySymbol()}
              {Math.round(income).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      <div className="mt-1 text-xs text-gray-400">
        Progressive tax brackets shown with rates from 10% to 50%.
      </div>

      <div className="mt-3" style={{ height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 40 }}
            barGap={0}
            barCategoryGap={2}
          >
            <XAxis
              dataKey="label"
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tickFormatter={(value) => `${value}%`}
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              domain={[0, 60]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.bracket}
                  fill={entry.color}
                  fillOpacity={entry.isCurrentBracket ? 1 : 0.5}
                  stroke={entry.isCurrentBracket ? '#FFFFFF' : 'none'}
                  strokeWidth={entry.isCurrentBracket ? 1 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 text-xs text-gray-400 text-center">
        <p>Tax rates apply to different portions of your income, not the entire amount.</p>
        <p className="mt-1">
          <a
            href="https://www.gov.il/en/departments/israel_tax_authority"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300"
          >
            Source: Israel Tax Authority 2025 Rates (Monthly)
          </a>
        </p>
        <div className="mt-3 p-2 border border-gray-700/20 rounded-md bg-gray-800/20">
          <p className="font-medium mb-1">Important Disclaimer:</p>
          <p>This chart only shows the basic tax brackets and does not account for:</p>
          <ul className="list-disc list-inside mt-1 space-y-0.5">
            <li>Credit points (נקודות זיכוי) which significantly reduce tax liability</li>
            <li>Tax deductions (ניכויים) or tax credits (זיכויים)</li>
            <li>
              National Insurance (ביטוח לאומי) and Health Insurance (ביטוח בריאות) contributions
            </li>
            <li>Special tax rates for certain income types (passive income, investments, etc.)</li>
            <li>Personal circumstances that may affect your tax liability</li>
          </ul>
          <p className="mt-2">
            This visualization is for informational purposes only and should not be considered tax
            advice. Please consult a certified tax professional for accurate tax calculations based
            on your specific situation.
          </p>
        </div>
      </div>
    </>
  );
}
