import { Identifiable, Timestamps } from '@/types/base';
import { User } from '@/types/user';

export interface UserWhatsappLink extends Identifiable, Timestamps {
    id: number;
    user_id: number;
    whatsapp_profile_id: string;
    first_name: string | null;
    full_name: string | null;
    push_name: string | null;
    revoked_at: string | null;
    user: User;
}
