export interface RelatedClubEvent {
  clubId: number;
  clubName: string;
  eventId: number;
  eventName: string;
  eventDate: string | [number, number, number, number, number, number, number];
}

export interface Notification {
  id: number;
  createdAt: string | [number, number, number, number, number, number, number];
  updatedAt: string | [number, number, number, number, number, number, number];
  active: boolean;
  message: string;
  sendDate: string | [number, number, number, number, number, number, number];
  relatedClubEvents: RelatedClubEvent[];
}

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
  timestamp: number;
}
