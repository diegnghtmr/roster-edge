import React from 'react';
import type { Notification, RelatedClubEvent } from '@/interface/INotification';

interface NotificationItemListProps {
  notification: Notification | null;
}

export const NotificationItemList: React.FC<NotificationItemListProps> = ({ notification }) => {
  // Handle null or undefined notification
  if (!notification) {
    return (
      <tr className="border-b hover:bg-gray-50 transition-colors duration-200">
        <td colSpan={4} className="px-6 py-4 text-sm text-center text-gray-500">
          Datos de notificación no disponibles
        </td>
      </tr>
    );
  }
  // Format date (string ISO or array) to readable format
  const formatDateTime = (
    dateValue: string | [number, number, number, number, number, number, number]
  ): string => {
    if (!dateValue) {
      console.warn('Empty date value provided');
      return 'N/A';
    }
    try {
      let date: Date;

      if (Array.isArray(dateValue)) {
        // Handle array format [year, month, day, hour, minute]
        const [year, month, day, hour, minute] = dateValue;
        date = new Date(year, month - 1, day, hour, minute);
      } else {
        // Handle ISO string format
        date = new Date(dateValue);
      }

      if (isNaN(date.getTime())) {
        console.warn('Invalid date value:', dateValue);
        return 'Fecha inválida';
      }
      return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting date:', error, 'Date value:', dateValue);
      return 'Error fecha';
    }
  };

  const getRelatedClubsText = (events: RelatedClubEvent[] | undefined) => {
    if (!events || events.length === 0) {
      return 'Sin clubes';
    }
    const clubNames = events.map((event) => event.clubName).filter(Boolean);
    return clubNames.length > 0 ? clubNames.join(', ') : 'Sin nombres de clubes';
  };

  const getRelatedEventsText = (events: RelatedClubEvent[] | undefined) => {
    if (!events || events.length === 0) {
      return 'Sin eventos';
    }
    const eventNames = events.map((event) => event.eventName).filter(Boolean);
    return eventNames.length > 0 ? [...new Set(eventNames)].join(', ') : 'Sin nombres de eventos';
  };

  return (
    <tr className="border-b hover:bg-gray-50 transition-colors duration-200">
      <td className="px-6 py-4 text-sm font-medium text-gray-900">{notification?.id || 'N/A'}</td>
      <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
        <div className="line-clamp-2">{notification?.message || 'Sin mensaje'}</div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">{formatDateTime(notification.sendDate)}</td>
      <td className="px-6 py-4 text-sm">{getRelatedClubsText(notification?.relatedClubEvents)}</td>
      <td className="px-6 py-4 text-sm">{getRelatedEventsText(notification?.relatedClubEvents)}</td>
    </tr>
  );
};
