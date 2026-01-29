import { getData, patchData, putData } from './index';

// ----------------------------------------------------------------------
// Notifications
// ----------------------------------------------------------------------

export type GetNotificationsParams = {
	page?: number;
	limit?: number;
	unreadOnly?: boolean;
};

export const getNotifications = (
	params?: GetNotificationsParams,
): ApiRequestResponseType<NotificationsResponse> => {
	return getData('/api/v1/notifications', { params });
};

export const markNotificationAsRead = (
	id: string,
): ApiRequestResponseType<{ notification: AppNotification }> => {
	return patchData(`/api/v1/notifications/${id}/read`, {});
};

export const markAllNotificationsAsRead = (): ApiRequestResponseType<void> => {
	return patchData('/api/v1/notifications/read-all', {});
};

// ----------------------------------------------------------------------
// Notification Preferences (Creators Only)
// ----------------------------------------------------------------------

export const getNotificationPreferences =
	(): ApiRequestResponseType<NotificationPreferences> => {
		return getData('/api/v1/notifications/preferences');
	};

export const updateNotificationPreferences = (
	data: Partial<NotificationPreferences>,
): ApiRequestResponseType<NotificationPreferences> => {
	return putData('/api/v1/notifications/preferences', data);
};
