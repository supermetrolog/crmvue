import { Identifiable, Timestamps } from '@/types/base';

export interface UserTelegramLink extends Identifiable, Timestamps {
    user_id: number;
    telegram_user_id: number;
    chat_id: number;
    username: string | null;
    first_name: string | null;
    last_name: string | null;
    is_enabled: boolean;
    revoked_at: string | null;
}
