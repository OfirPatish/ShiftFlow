'use client';

import { Employer } from '@/types/models/employers';
import { MoreVertical } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/data-display/Card';

interface EmployerCardProps {
  employer: Employer;
  onEdit: (employer: Employer) => void;
}

export default function EmployerCard({ employer, onEdit }: EmployerCardProps) {
  const handleEditClick = () => {
    onEdit(employer);
  };

  return (
    <Card borderColor={employer.color}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{employer.name}</CardTitle>

        <div
          onClick={handleEditClick}
          className="cursor-pointer flex items-center justify-center hover:bg-gray-800/50 p-1 rounded-md"
          aria-label="Edit employer"
        >
          <MoreVertical className="h-5 w-5 text-gray-300 hover:text-white transition-colors" />
        </div>
      </CardHeader>

      <CardContent>
        {employer.location && <p className="text-gray-300 text-sm">{employer.location}</p>}
      </CardContent>
    </Card>
  );
}
