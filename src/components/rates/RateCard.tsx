import { format } from 'date-fns';
import { Rate } from '@/types/models/rates';
import { MoreVertical } from 'lucide-react';
import { useEmployers } from '@/hooks/api/useEmployers';
import { Card, CardHeader, CardContent } from '@/components/ui/data-display/Card';
import { getCurrencySymbol } from '@/lib/utils/currencyFormatter';

interface RateCardProps {
  rate: Rate;
  onEdit: (rate: Rate) => void;
}

export default function RateCard({ rate, onEdit }: RateCardProps) {
  const { employers } = useEmployers();

  // Find the employer for this rate
  const employer = employers.find((e) => e._id === rate.employerId);

  // Format currency - always use ILS
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleEditClick = () => {
    onEdit(rate);
  };

  return (
    <Card borderColor={employer?.color || '#3B82F6'}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center w-full">
          {/* Employer name */}
          <span className="font-medium text-white">{employer?.name || 'Employer'}</span>

          {/* Menu button */}
          <div
            onClick={handleEditClick}
            className="cursor-pointer flex items-center justify-center hover:bg-gray-800/50 p-1 rounded-md"
            aria-label="Edit rate"
          >
            <MoreVertical className="h-5 w-5 text-gray-300 hover:text-white transition-colors" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {/* Rate name with dot */}
        <div className="flex items-center mb-2">
          <span
            className="w-2 h-2 rounded-full mr-1.5"
            style={{ backgroundColor: employer?.color || '#3B82F6' }}
          ></span>
          <span className="text-sm text-gray-100">{rate.name}</span>

          {/* Default badge */}
          {rate.isDefault && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary-900/30 text-primary-300 border border-primary-800/30">
              Default
            </span>
          )}
        </div>

        {/* Hourly rate - aligned to the left */}
        <div className="flex items-center my-4">
          <span className="text-xl font-semibold text-primary-400">
            {getCurrencySymbol()}
            {formatCurrency(rate.baseRate)}/hr
          </span>
        </div>

        {/* Effective date only */}
        {rate.effectiveDate && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Effective date:</span>
            <span className="text-gray-300">
              {format(new Date(rate.effectiveDate), 'MMM d, yyyy')}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
