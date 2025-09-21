import { Identifiable, Timestamps } from '@/types/base';

export interface UserWhatsappLink extends Identifiable, Timestamps {
    user_id: number;
    profile_id: number;
    phone: string;
    revoked_at: string;
}
