import React from 'react';
import type { User } from '@/interface/IUser';
import { Badge } from '@/components/ui/badge';

interface UserItemListProps {
  user: User;
}

export const UserItemList: React.FC<UserItemListProps> = ({ user }) => {
  // Format ISO string or legacy array date to DD/MM/YYYY
  const formatDateOnly = (value: User['birthDate'] | User['createdAt']): string => {
    if (!value) {
      return 'N/A';
    }
    if (Array.isArray(value)) {
      if (value.length < 3) {
        return 'N/A';
      }
      const [year, month, day] = value;
      return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
    }
    if (typeof value !== 'string') {
      return 'N/A';
    }
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${date.getFullYear()}`;
    }
    const [datePart] = value.split('T');
    if (!datePart) {
      return 'N/A';
    }
    const [year, month, day] = datePart.split('-');
    if (!year || !month || !day) {
      return 'N/A';
    }
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  };

  const getActiveBadge = (active: boolean) => {
    return active ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Activo
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
        Inactivo
      </Badge>
    );
  };

  return (
    <tr className="border-b hover:bg-gray-50 transition-colors duration-200">
      <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.id}</td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {[user.name, user.lastName].filter(Boolean).join(' ').trim() || user.name}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
      <td className="px-6 py-4 text-sm text-gray-900">{user.phone || 'N/A'}</td>
      <td className="px-6 py-4 text-sm text-gray-900">{formatDateOnly(user.birthDate)}</td>
      <td className="px-6 py-4 text-sm text-gray-900">{user.cityName || 'N/A'}</td>
      <td className="px-6 py-4 text-sm">{getActiveBadge(user.active)}</td>
    </tr>
  );
};
