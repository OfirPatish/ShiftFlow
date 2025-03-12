import { format } from 'date-fns';
import { Rate } from '@/hooks/useRates';
import { MoreVertical } from 'lucide-react';
import { useEmployers } from '@/hooks/useEmployers';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

interface RateCardProps {
  rate: Rate;
  onEdit: (rate: Rate) => void;
  onDelete: (rateId: string) => void;
}

export default function RateCard({ rate, onEdit, onDelete }: RateCardProps) {
  const { employers } = useEmployers();

  // Find the employer for this rate
  const employer = employers.find((e) => e._id === rate.employerId);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: rate.currency,
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

          <div className="flex items-center">
            {/* Rate amount */}
            <span className="text-lg font-semibold text-primary-400 mr-2">
              {formatCurrency(rate.baseRate).replace(/\s/g, '')}/hr
            </span>

            {/* Default badge */}
            {rate.isDefault && (
              <span className="mr-2 px-2 py-0.5 text-xs rounded-full bg-primary-900/30 text-primary-300 border border-primary-800/30">
                Default
              </span>
            )}

            {/* Menu button */}
            <div
              onClick={handleEditClick}
              className="cursor-pointer flex items-center ml-2"
              aria-label="Edit rate"
            >
              <MoreVertical className="h-5 w-5 text-gray-300 hover:text-white transition-colors" />
            </div>
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
        </div>

        {/* Currency and effective date */}
        <div className="space-y-1 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Currency:</span>
            <span className="text-gray-300">{rate.currency}</span>
          </div>
          {rate.effectiveDate && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Effective date:</span>
              <span className="text-gray-300">
                {format(new Date(rate.effectiveDate), 'MMM d, yyyy')}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
