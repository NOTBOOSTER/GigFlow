import { useEffect } from 'react';
import type { ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { logger } from '../utils/logger';
import type { User } from '../types/user';
import { SocketContext, socket } from './socket';

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();

  const connectSocket = (user: User) => {
    if (!user) return;
    socket.connect();
    socket.emit('join', user._id);
    logger.info('Socket joining room', user._id);
  };

  const disconnectSocket = () => {
    if (socket.connected) {
      socket.disconnect();
      logger.info('Socket manually disconnected');
    }
  };

  useEffect(() => {
    if (currentUser) {
      connectSocket(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    socket.on('connect', () => {
      logger.success('Socket connected', socket.id);
    });

    socket.on('disconnect', () => {
      logger.warn('Socket disconnected');
    });

    const handleNotification = (data: any) => {
      logger.info('New Notification', data);
      const message = data.message || `You have been hired for ${data.gigTitle || 'a gig'}!`;

      if (data.type === 'HIRED') {
        toast.success(message);
      } else {
        toast.success(message);
      }

      if (Notification.permission === 'granted') {
        new Notification('GigFlow Notification', {
          body: message,
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('GigFlow Notification', {
              body: message,
            });
          }
        });
      }
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('notification', handleNotification);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connectSocket, disconnectSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
