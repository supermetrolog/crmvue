import { Identifiable, Timestamps } from '@/types/base';
import { UserNotificationAction } from '@/types/user-notification/user-notification-action';

export interface UserNotification extends Identifiable, Timestamps {
    subject: string;
    message: string;
    user_id: number;
    viewed_at: string | null;
    acted_at: string | null;
    expires_at: string | null;
    actions: UserNotificationAction[];
    template_id: number | null;
    template: UserNotificationTemplate | null;
}

export interface ShortUserNotification extends Identifiable, Timestamps {
    viewed_at: string | null;
}

export interface UserNotificationTemplate extends Identifiable, Timestamps {
    kind: string;
    category: string;
    priority: string;
    is_active: string;
}
