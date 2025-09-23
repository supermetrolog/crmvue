import { TabLeadershipService } from './tab-leadership';
import { IncomingNotification, NotificationBrokerService, toPriority } from './notification-broker';
import { pushUserNotificationToast } from '@/composables/useUserNotificationToasts';

const DEBUG = import.meta.env.DEV;

async function showToast(notification: IncomingNotification) {
    await pushUserNotificationToast({
        notificationId: notification.notification_id,
        priority: toPriority(notification.priority)
    });
}

let leadership: TabLeadershipService | null = null;
let broker: NotificationBrokerService | null = null;

export function initNotifications(userId: number) {
    if (!leadership) {
        leadership = new TabLeadershipService({ userId, settleMs: 5000, debug: DEBUG });
        leadership.start();
    }

    if (!broker) {
        broker = new NotificationBrokerService(userId, leadership, showToast, DEBUG);
        broker.start();
    }
}

export function publishNotificationFromWS(payload: IncomingNotification) {
    if (!broker) return;

    broker.publishFromWS(payload);
}

export function destroyNotifications() {
    if (broker) broker.stop();
    if (leadership) leadership.stop();

    broker = null;
    leadership = null;
}

export function pauseNotifications(scope = 'global') {
    broker?.pause(scope);
}

export function resumeNotifications(scope?: string) {
    broker?.resume(scope);
}
