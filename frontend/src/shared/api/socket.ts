import { io } from 'socket.io-client';

// @ts-ignore
const url = import.meta.env.VITE_APP_BACKEND_API_URL;

export const socket = io(`${url}ws`, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
});

export const useSocket = () => {
    if (!socket.connected) {
        socket.connect();
    }
    return socket;
};
