import { createContext } from 'react';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import type { User } from '../types/user';

export interface SocketContextType {
    socket: Socket | null;
    connectSocket: (user: User) => void;
    disconnectSocket: () => void;
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
    autoConnect: false,
});
