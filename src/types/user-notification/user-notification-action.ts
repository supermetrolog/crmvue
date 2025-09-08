import { Identifiable } from '@/types/base';

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
