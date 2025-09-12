import { createSharedComposable, type EventBusKey, useEventBus } from '@vueuse/core';

export type UserNotificationEvent =
    | { type: 'created'; id: number }
    | { type: 'acted'; id: number }
    | { type: 'viewed'; id: number };

export const UserNotificationEventKey: EventBusKey<UserNotificationEvent> =
    Symbol('notifications:bus');

export const useUserNotificationsBus = createSharedComposable(() =>
    useEventBus<UserNotificationEvent>('user-notification:acted')
);
