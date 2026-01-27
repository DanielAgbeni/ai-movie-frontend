import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type AuthState = {
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
	expiresIn: number | null;
	isAuthenticated: boolean;
	isRefreshing: boolean;
};

type AuthActions = {
	setAuth: (data: LoginResponseData) => void;
	setAccessToken: (token: string, expiresIn?: number) => void;
	setRefreshToken: (token: string) => void;
	logout: () => void;
	getAccessToken: () => string | null;
	getRefreshToken: () => string | null;
	setRefreshing: (isRefreshing: boolean) => void;
};

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
	persist(
		(set, get) => ({
			// State
			user: null,
			accessToken: null,
			refreshToken: null,
			expiresIn: null,
			isAuthenticated: false,
			isRefreshing: false,

			// Actions
			setAuth: (data: LoginResponseData) => {
				set({
					user: data.user,
					accessToken: data.accessToken,
					refreshToken: data.refreshToken,
					expiresIn: data.expiresIn,
					isAuthenticated: true,
				});
			},

			setAccessToken: (token: string, expiresIn?: number) => {
				set({
					accessToken: token,
					...(expiresIn !== undefined && { expiresIn }),
				});
			},

			setRefreshToken: (token: string) => {
				set({ refreshToken: token });
			},

			logout: () => {
				set({
					user: null,
					accessToken: null,
					refreshToken: null,
					expiresIn: null,
					isAuthenticated: false,
					isRefreshing: false,
				});
			},

			getAccessToken: () => get().accessToken,
			getRefreshToken: () => get().refreshToken,
			setRefreshing: (isRefreshing: boolean) => {
				set({ isRefreshing });
			},
		}),
		{
			name: 'auth-storage',
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				user: state.user,
				accessToken: state.accessToken,
				refreshToken: state.refreshToken,
				expiresIn: state.expiresIn,
				isAuthenticated: state.isAuthenticated,
				// We generally don't persist isRefreshing, but it's fine
			}),
		},
	),
);

// Selector hooks for optimized re-renders
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
	useAuthStore((state) => state.isAuthenticated);
export const useAccessToken = () => useAuthStore((state) => state.accessToken);
export const useIsRefreshing = () =>
	useAuthStore((state) => state.isRefreshing);
