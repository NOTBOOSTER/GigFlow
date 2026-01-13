import api from './axios';
import type { Gig, CreateGigInput } from '../types/gig';
import { logger } from '../utils/logger';

export const gigApi = {
    getAll: async (search?: string) => {
        try {
            const params = search ? { search } : {};
            const res = await api.get<{ success: boolean; count: number; data: Gig[] }>('/gigs', { params });
            logger.info('Fetched gigs', res.data.count);
            return res.data;
        } catch (error) {
            logger.error('Failed to fetch gigs', error);
            throw error;
        }
    },

    getOne: async (id: string) => {
        try {
            const res = await api.get<{ success: boolean; data: Gig }>(`/gigs/${id}`);
            logger.info(`Fetched gig ${id}`);
            return res.data;
        } catch (error) {
            logger.error(`Failed to fetch gig ${id}`, error);
            throw error;
        }
    },

    create: async (data: CreateGigInput) => {
        try {
            const res = await api.post<{ success: boolean; data: Gig }>('/gigs', data);
            logger.success('Gig created successfully');
            return res.data;
        } catch (error) {
            logger.error('Failed to create gig', error);
            throw error;
        }
    },

    update: async (id: string, data: Partial<CreateGigInput>) => {
        try {
            const res = await api.put<Gig>(`/gigs/${id}`, data);
            logger.success(`Gig ${id} updated`);
            return res.data;
        } catch (error) {
            logger.error(`Failed to update gig ${id}`, error);
            throw error;
        }
    },

    delete: async (id: string) => {
        try {
            await api.delete(`/gigs/${id}`);
            logger.success(`Gig ${id} deleted`);
        } catch (error) {
            logger.error(`Failed to delete gig ${id}`, error);
            throw error;
        }
    },
};
