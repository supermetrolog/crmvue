import { onMounted, onUnmounted } from 'vue';
import { pauseNotifications, resumeNotifications } from '@/services/notifications/notifications';

export function useUserNotificationsPause(scope: string) {
    onMounted(() => pauseNotifications(scope));
    onUnmounted(() => resumeNotifications(scope));
}
