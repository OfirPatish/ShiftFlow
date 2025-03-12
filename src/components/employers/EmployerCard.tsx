'use client';

import { Employer } from '@/hooks/useEmployers';
import { MoreVertical } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardItem,
} from '@/components/ui/Card';

interface EmployerCardProps {
  employer: Employer;
  onEdit: (employer: Employer) => void;
  onDelete: (employerId: string) => void;
}

export default function EmployerCard({ employer, onEdit, onDelete }: EmployerCardProps) {
  const handleEditClick = () => {
    onEdit(employer);
  };

  return (
    <Card borderColor={employer.color}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{employer.name}</CardTitle>

        <div
          onClick={handleEditClick}
          className="cursor-pointer flex items-center justify-center"
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
