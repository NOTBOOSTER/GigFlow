import api from './axios';
import type { User } from '../types/user';
import { logger } from '../utils/logger';

export const authApi = {
    register: async (data: { name: string; email: string; password: string; role: 'client' | 'freelancer' }) => {
        try {
            logger.info('Sending registration data:', data);
            const res = await api.post('/auth/register', data);
            logger.success('User registered successfully');
            return res.data;
        } catch (error) {
            logger.error('Registration failed', error);
            throw error;
        }
    },

    login: async (data: { email: string; password: string }) => {
        try {
            const res = await api.post<User>('/auth/login', data);
            logger.success('Login successful');
            return res.data;
        } catch (error) {
            logger.error('Login failed', error);
            throw error;
        }
    },

    logout: async () => {
        try {
            await api.get('/auth/logout');
            logger.success('Logged out successfully');
        } catch (error) {
            logger.error('Logout failed', error);
            throw error;
        }
    },

    getCurrentUser: async () => {
        try {
            const res = await api.get<User>('/auth/me');
            logger.info('Fetched current user', res.data);
            return res.data;
        } catch (error) {
            return null;
        }
    },
};
