import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

const SOCKET_URL =
	process.env.NEXT_PUBLIC_SOCKET_URL ||
	process.env.NEXT_PUBLIC_BACKEND_URL ||
	'';

export type ServerToClientEvents = {
	notification: (notification: AppNotification) => void;
	connect: () => void;
	disconnect: () => void;
	error: (error: Error) => void;
};

export type ClientToServerEvents = {
	// Add any client-to-server events here if needed
};

export function getSocket(
	token: string,
): Socket<ServerToClientEvents, ClientToServerEvents> {
	if (socket?.connected) {
		return socket;
	}

	// Disconnect existing socket if any
	if (socket) {
		socket.disconnect();
	}

	socket = io(SOCKET_URL, {
		auth: { token },
		transports: ['websocket', 'polling'],
		reconnection: true,
		reconnectionAttempts: 5,
		reconnectionDelay: 1000,
		reconnectionDelayMax: 5000,
	});

	return socket;
}

export function disconnectSocket(): void {
	if (socket) {
		socket.disconnect();
		socket = null;
	}
}

export function getSocketInstance(): Socket | null {
	return socket;
}
