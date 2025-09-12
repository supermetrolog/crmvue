import { Identifiable } from '@/types/base';
import { ShortUserNotification } from '@/types/user-notification/user-notification';
import { User } from '@/types/user';

export interface UserNotificationAction extends Identifiable {
    user_notification_id: number;
    type: 'navigate' | 'command';
    code: string;
    label: string;
    icon: string | null;
    style: 'light' | 'primary' | 'danger' | 'success' | null;
    confirmation: boolean;
    order: number;
    payload: Record<string, any> | null;

    logs: UserNotificationActionLog[];
}

export interface UserNotificationActionLog extends Identifiable {
    action_id: number;
    user_id: number;
    user_notification_id: number;
    executed_at: string;
}

export interface SearchedUserNotificationActionLog extends UserNotificationActionLog {
    action: UserNotificationAction;
    notification: ShortUserNotification;
    user: User;
}
