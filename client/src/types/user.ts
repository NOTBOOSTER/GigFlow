export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'client' | 'freelancer';
    desc?: string;
    img?: string;
    country: string;
    createdAt: string;
    updatedAt: string;
}
