import { Identifiable, Timestamps } from '@/types/base';

export interface UserTelegramLinkTicket extends Identifiable, Timestamps {
    user_id: number;
    expires_at: string;
    consumed_at: string;
}
