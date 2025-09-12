import { Identifiable, Timestamps } from '@/types/base';

export interface UserNotificationTemplate extends Identifiable, Timestamps {
    kind: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    priority_label: string;
    category: string;
    category_label: string;
    is_active: boolean;
}
