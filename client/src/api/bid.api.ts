import api from './axios';
import type { Bid, CreateBidInput } from '../types/bid';
import { logger } from '../utils/logger';
import type { Gig } from '../types/gig';

export const bidApi = {
    create: async (data: CreateBidInput) => {
        try {
            const res = await api.post<Bid>('/bids', data);
            logger.success('Bid placed successfully');
            return res.data;
        } catch (error) {
            logger.error('Failed to place bid', error);
            throw error;
        }
    },

    getByGigId: async (gigId: string) => {
        try {
            const res = await api.get<{ success: boolean; count: number; data: Bid[] }>(`/bids/${gigId}`);
            logger.info(`Fetched bids for gig ${gigId}`, res.data.count);
            return res.data;
        } catch (error) {
            logger.error(`Failed to fetch bids for gig ${gigId}`, error);
            throw error;
        }
    },

    hire: async (bidId: string, gig: Gig) => {
        try {
            const res = await api.patch<{ success: boolean; data: Bid }>(`/bids/${bidId}/hire`, { gigId: gig._id });
            logger.success(`Bid ${bidId} hired`);
            return res.data;
        } catch (error) {
            logger.error(`Failed to hire bid ${bidId}`, error);
            throw error;
        }
    },

    getMyBids: async () => {
        try {
            const res = await api.get<{ success: boolean; count: number; data: Bid[] }>('/bids');
            logger.info('Fetched user bids', res.data.count);
            return res.data;
        } catch (error) {
            logger.error('Failed to fetch user bids', error);
            throw error;
        }
    },
};

