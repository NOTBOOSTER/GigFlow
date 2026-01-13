import type { Gig } from "./gig";

export interface Bid {
    _id: string;
    gig: Gig;
    freelancer: freelancer;
    freelancerId: string;
    amount: number;
    message: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
    updatedAt: string;
}

export interface CreateBidInput {
    gig: string;
    amount: number;
    message: string;
}

export interface freelancer {
    name: string;
}