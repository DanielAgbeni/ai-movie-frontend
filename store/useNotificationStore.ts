import { create } from 'zustand';

type NotificationState = {
	unreadCount: number;
	notifications: AppNotification[];
	isConnected: boolean;
};

type NotificationActions = {
	setUnreadCount: (count: number) => void;
	incrementUnreadCount: () => void;
	decrementUnreadCount: () => void;
	resetUnreadCount: () => void;
	addNotification: (notification: AppNotification) => void;
	setNotifications: (notifications: AppNotification[]) => void;
	markAsRead: (id: string) => void;
	markAllAsRead: () => void;
	setConnected: (connected: boolean) => void;
	reset: () => void;
};

type NotificationStore = NotificationState & NotificationActions;

const initialState: NotificationState = {
	unreadCount: 0,
	notifications: [],
	isConnected: false,
};

export const useNotificationStore = create<NotificationStore>()((set, get) => ({
	...initialState,

	setUnreadCount: (count: number) => {
		set({ unreadCount: count });
	},

	incrementUnreadCount: () => {
		set((state) => ({ unreadCount: state.unreadCount + 1 }));
	},

	decrementUnreadCount: () => {
		set((state) => ({
			unreadCount: Math.max(0, state.unreadCount - 1),
		}));
	},

	resetUnreadCount: () => {
		set({ unreadCount: 0 });
	},

	addNotification: (notification: AppNotification) => {
		const { notifications } = get();
		// Avoid duplicates by checking ID
		const exists = notifications.some((n) => n._id === notification._id);
		if (!exists) {
			set({
				notifications: [notification, ...notifications],
			});
		}
	},

	setNotifications: (notifications: AppNotification[]) => {
		set({ notifications });
	},

	markAsRead: (id: string) => {
		set((state) => ({
			notifications: state.notifications.map((n) =>
				n._id === id ? { ...n, isRead: true, read: true } : n,
			),
		}));
	},

	markAllAsRead: () => {
		set((state) => ({
			notifications: state.notifications.map((n) => ({
				...n,
				isRead: true,
				read: true,
			})),
			unreadCount: 0,
		}));
	},

	setConnected: (connected: boolean) => {
		set({ isConnected: connected });
	},

	reset: () => {
		set(initialState);
	},
}));

// Selector hooks for optimized re-renders
export const useUnreadCount = () =>
	useNotificationStore((state) => state.unreadCount);
export const useNotificationsList = () =>
	useNotificationStore((state) => state.notifications);
export const useIsSocketConnected = () =>
	useNotificationStore((state) => state.isConnected);
