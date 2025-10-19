import { ref, shallowRef } from 'vue';
import { createSharedComposable } from '@vueuse/core';

export type UserNotificationToast = {
    id?: number;
    notificationId: number;
    priority?: number;
    _ts?: number;
};

export type UserNotificationCloseReason = 'timeout' | 'button' | 'dismiss';

export type UserNotificationToastResolverResult = {
    reason: UserNotificationCloseReason;
    action?: string;
};

export type UserNotificationToastResolver = ((
    result: UserNotificationToastResolverResult
) => void) & {
    __id?: number;
};

let uid = 1;

const queue: UserNotificationToast[] = [];
const callbacks: UserNotificationToastResolver[] = [];

let resolver: UserNotificationToastResolver | null = null;
let timer: number | null = null;
let processing = false;

const isOpen = ref(false);
const current = shallowRef<UserNotificationToast | null>(null);
const pending = ref(0);

export function pushUserNotificationToast(
    item: UserNotificationToast
): Promise<{ reason: string; action?: string; item: UserNotificationToast }> {
    item.id ??= uid++;
    item.priority ??= 0;
    item._ts = Date.now();

    const idx = findInsertIndex(item);
    queue.splice(idx, 0, item);

    pending.value = queue.length + (current.value ? 1 : 0);

    process();

    return new Promise(resolve => {
        const unwatch = watchOnceItem(item.id!, result => {
            unwatch();
            resolve({ ...result, item });
        });
    });
}

function findInsertIndex(item: UserNotificationToast): number {
    const size = queue.length;

    for (let i = 0; i < size; i++) {
        const current = queue[i];

        const itemPriority = item.priority ?? 0;
        const currentPriority = current.priority ?? 0;

        if (itemPriority > currentPriority) return i;

        if (itemPriority === currentPriority && item._ts! < (current._ts ?? 0)) return i;
    }

    return size;
}

function watchOnceItem(id: number, cb: UserNotificationToastResolver) {
    cb.__id = id;

    callbacks.push(cb);

    return () => {
        const idx = callbacks.indexOf(cb);
        if (idx >= 0) callbacks.splice(idx, 1);
    };
}

function process() {
    if (processing) return;

    processing = true;

    const step = async () => {
        while (queue.length > 0) {
            current.value = queue.shift()!;
            isOpen.value = true;

            pending.value = queue.length + 1;

            const target = current.value;

            const result = await waitClose();
            notifyCallbacks(target.id!, result);

            isOpen.value = false;
            current.value = null;
            pending.value = queue.length;
        }

        processing = false;
    };

    void step();
}

function notifyCallbacks(id: number, result: UserNotificationToastResolverResult) {
    const toCall = callbacks.filter(cb => cb.__id === id);

    toCall.forEach(cb => cb(result));

    for (const cb of toCall) {
        const idx = callbacks.indexOf(cb);
        if (idx >= 0) callbacks.splice(idx, 1);
    }
}

function waitClose() {
    return new Promise<UserNotificationToastResolverResult>(resolve => {
        resolver = resolve;
    });
}

function close(reason: UserNotificationCloseReason = 'button') {
    if (!isOpen.value) return;

    if (timer) {
        clearTimeout(timer);
        timer = null;
    }

    const res = { reason };

    resolver?.(res);
    resolver = null;
}

function action(value: string) {
    if (!isOpen.value) return;

    if (timer) {
        clearTimeout(timer);
        timer = null;
    }

    resolver?.({ reason: 'button', action: value });
    resolver = null;
}

function dismissAll(reason: UserNotificationCloseReason = 'dismiss') {
    if (isOpen.value) {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }

        const result = { reason };

        resolver?.(result);
        resolver = null;

        const target = current.value;

        if (target?.id != null) {
            notifyCallbacks(target.id, result);
        }

        isOpen.value = false;
        current.value = null;
    }

    const resultQueued = { reason };

    while (queue.length) {
        const it = queue.shift()!;
        if (it.id != null) notifyCallbacks(it.id, resultQueued);
    }

    pending.value = 0;
    processing = false;
}

export const useUserNotificationToasts = createSharedComposable(() => {
    return {
        current,
        isOpen,
        pending,
        push: pushUserNotificationToast,
        close,
        action,
        dismissAll
    };
});
