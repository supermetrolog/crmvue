import { Timestamps } from '@/types/base';

export interface UserProfile {
    avatar: string | null;
    caller_id: string;
    first_name: string | null;
    full_name: string;
    id: 2;
    last_name: string | null;
    medium_name: string;
    middle_name: string | null;
    short_name: string;
    user_id: number;
}

export const UserRoleEnum = {
    SYSTEM: 6,
    ADMIN: 5,
    OWNER: 4,
    MODERATOR: 3,
    CONSULTANT: 2,
    GUEST: 1
} as const;

export type UserRole = (typeof UserRoleEnum)[keyof typeof UserRoleEnum];

export interface User extends Timestamps {
    id: number;
    last_seen?: string | null;
    is_online?: boolean;
    role: UserRole;
    userProfile: UserProfile;
}
