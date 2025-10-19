import { Identifiable, Timestamps } from '@/types/base';
import { UserNotificationAction } from '@/types/user-notification/user-notification-action';
import { User } from '@/types/user';
import { UserNotificationTemplate } from '@/types/user-notification/user-notification-template';

export interface UserNotificationRelation extends Identifiable, Timestamps {
    entity_id: number;
    entity_type: string;
    notification_id: number;
}

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
    createdBy?: User;
    relations: UserNotificationRelation[];
}

export interface ShortUserNotification extends Identifiable, Timestamps {
    subject: string;
    message: string;
    user_id: number;
    viewed_at: string | null;
    acted_at: string | null;
    expires_at: string | null;
    template_id: number | null;
    template: UserNotificationTemplate | null;
    createdBy?: User;
}
