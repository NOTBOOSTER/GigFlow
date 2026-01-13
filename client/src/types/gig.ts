import type { User } from './user';

export interface Gig {
    _id: string;
    title: string;
    description: string;
    budget: number;
    owner: User | string;
    status: 'open' | 'assigned' | 'completed';
    hiredBid?: {
        _id: string;
        amount: number;
        message: string;
        freelancer: User;
    }
    createdAt: string;
    updatedAt: string;
}

export interface CreateGigInput {
    title: string;
    description: string;
    budget: number;
}
