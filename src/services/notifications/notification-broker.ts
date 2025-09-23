import { TabLeadershipService } from './tab-leadership';
import { getFromLocalstorage, setInLocalstorage } from '@/services/localStorage';
import { captureException } from '@sentry/vue';

export type IncomingNotification = {
    notification_id: number;
    priority?: 'low' | 'normal' | 'high' | 'urgent' | number;
};

export type DisplayHandler = (notification: IncomingNotification) => Promise<void> | void;

const stringPriorityToIntMap: Record<string, number> = {
    low: 1,
    normal: 2,
    high: 3,
    urgent: 4
} as const;

export function toPriority(priority?: string | number): number {
    if (typeof priority === 'number') return priority;

    if (!priority) return 0;

    return stringPriorityToIntMap[priority] ?? 0;
}

export class NotificationBrokerService {
    private readonly leadership: TabLeadershipService;
    private readonly display: DisplayHandler;
    private readonly debug: boolean;
    private inflightTtlMs = 10 * 60 * 1000;
    private seenTtlMs = 10 * 60 * 1000;

    private subscriptions: Array<() => void> = [];
    private pausedScopes = new Set<string>();

    private userId: number;
    private LS: Record<string, string>;
    private started = false;

    constructor(
        userId: number,
        leadership: TabLeadershipService,
        displayHandler: DisplayHandler,
        debug = false
    ) {
        this.debug = debug;

        this.userId = userId;

        this.LS = {
            queue: `notify.${this.userId}.queue`,
            seen: `notify.${this.userId}.seen`,
            inflight: `notify.${this.userId}.inflight`,
            leaderTabId: `notify.${this.userId}.leaderTabId`,
            attentionFlag: `notify.${this.userId}.attentionFlag`,
            attentionTabId: `notify.${this.userId}.attentionTabId`
        };

        this.leadership = leadership;
        this.display = displayHandler;

        this.onStorage = this.onStorage.bind(this);
    }

    start() {
        if (this.started) return;
        this.started = true;

        window.addEventListener('storage', this.onStorage, false);

        this.subscriptions.push(
            this.leadership.onLeaderChange(() => this.flushIfEffectiveLeader()),
            this.leadership.onAttentionChange(() => this.flushIfEffectiveLeader())
        );

        this.pruneExpiredInflight();
        this.pruneExpiredSeen();

        void this.flushIfEffectiveLeader();
    }

    stop() {
        if (!this.started) return;

        this.started = false;

        window.removeEventListener('storage', this.onStorage);

        while (this.subscriptions.length) {
            const stop = this.subscriptions.pop()!;

            try {
                stop();
            } catch (error) {
                this.error(error);
            }
        }
    }

    pause(scope = 'global') {
        this.pausedScopes.add(scope);
    }

    resume(scope?: string) {
        if (scope) this.pausedScopes.delete(scope);
        else this.pausedScopes.clear();

        void this.flushIfEffectiveLeader();
    }

    publishFromWS(notification: IncomingNotification) {
        this.enqueue(notification);

        if (!this.isPaused()) {
            void this.flushIfEffectiveLeader();
        }
    }

    changeUserId(userId: number) {
        this.userId = userId;

        this.LS = {
            queue: `notify.${this.userId}.queue`,
            seen: `notify.${this.userId}.seen`,
            inflight: `notify.${this.userId}.inflight`,
            leaderTabId: `notify.${this.userId}.leaderTabId`,
            attentionFlag: `notify.${this.userId}.attentionFlag`,
            attentionTabId: `notify.${this.userId}.attentionTabId`
        };
    }

    private readQueue() {
        try {
            return JSON.parse(getFromLocalstorage(this.LS.queue) || '{"ids":[],"items":[]}') as {
                ids: number[];
                items: IncomingNotification[];
            };
        } catch (error) {
            this.error(error);

            return { ids: [], items: [] };
        }
    }

    private writeQueue(queue: { ids: number[]; items: IncomingNotification[] }) {
        setInLocalstorage(this.LS.queue, JSON.stringify(queue));
    }

    private readSeen(): Record<number, number> {
        try {
            const raw = getFromLocalstorage(this.LS.seen) || '{}';
            return JSON.parse(raw);
        } catch (error) {
            this.error(error);

            return {};
        }
    }

    private writeSeen(map: Record<number, number>) {
        setInLocalstorage(this.LS.seen, JSON.stringify(map));
    }

    private readInflight(): Record<number, number> {
        try {
            const raw = getFromLocalstorage(this.LS.inflight) || '{}';
            return JSON.parse(raw);
        } catch (e) {
            this.error(e);
            return {};
        }
    }

    private writeInflight(map: Record<number, number>) {
        setInLocalstorage(this.LS.inflight, JSON.stringify(map));
    }

    private pruneExpiredInflight() {
        const now = this.nowMs();
        const inflight = this.readInflight();
        let changed = false;

        for (const k in inflight) {
            const until = inflight[k as unknown as number];

            if (!until || until <= now) {
                delete inflight[k as unknown as number];
                changed = true;
            }
        }

        if (changed) this.writeInflight(inflight);
    }

    private pruneExpiredSeen() {
        const now = this.nowMs();
        const seen = this.readSeen();
        let changed = false;

        for (const k in seen) {
            const until = seen[k as unknown as number];

            if (!until || until <= now) {
                delete seen[k as unknown as number];
                changed = true;
            }
        }

        if (changed) this.writeSeen(seen);
    }

    private isInflightActive(id: number, inflight?: Record<number, number>) {
        const map = inflight ?? this.readInflight();
        const until = map[id];
        return until > this.nowMs();
    }

    private isSeenActive(id: number, seen?: Record<number, number>) {
        const map = seen ?? this.readSeen();
        const until = map[id];
        return until > this.nowMs();
    }

    private nowMs() {
        return Date.now();
    }

    private enqueue(notification: IncomingNotification) {
        const notificationId = notification.notification_id;

        this.pruneExpiredInflight();
        this.pruneExpiredSeen();

        if (this.isSeenActive(notificationId)) return;
        if (this.isInflightActive(notificationId)) return;

        const queue = this.readQueue();

        if (!queue.ids.includes(notificationId)) {
            queue.ids.push(notificationId);
            queue.items.push(notification);

            this.writeQueue(queue);
        }
    }

    private isPaused() {
        return this.pausedScopes.size > 0;
    }

    private isEffectiveLeaderNow() {
        return (
            this.leadership.getIsLeader() &&
            getFromLocalstorage(this.LS.attentionFlag) === 'true' &&
            getFromLocalstorage(this.LS.attentionTabId) === this.leadership.getTabId()
        );
    }

    private async flushIfEffectiveLeader() {
        if (!this.isEffectiveLeaderNow()) {
            return;
        }

        if (this.isPaused()) {
            return;
        }

        this.pruneExpiredInflight();
        this.pruneExpiredSeen();

        const queue = this.readQueue();

        if (!queue.items.length) {
            return;
        }

        const now = this.nowMs();
        const inflight = this.readInflight();

        for (const n of queue.items) {
            const id = n.notification_id;

            if (!this.isInflightActive(id, inflight)) {
                inflight[id] = now + this.inflightTtlMs;
            }
        }

        this.writeInflight(inflight);
        this.writeQueue({ ids: [], items: [] });

        await this.flushList(queue.items);
    }

    private async flushList(items: IncomingNotification[]) {
        for (const notification of items) {
            const seen = this.readSeen();
            if (seen[notification.notification_id]) continue;

            try {
                await this.display(notification);
            } catch (error) {
                this.error(error);
            }

            const now = this.nowMs();
            seen[notification.notification_id] = now + this.seenTtlMs;
            this.writeSeen(seen);

            const inflight = this.readInflight();
            delete inflight[notification.notification_id];
            this.writeInflight(inflight);
        }
    }

    private onStorage(event: StorageEvent) {
        if (!event.key) return;

        if (
            event.key === this.LS.leaderTabId ||
            event.key === this.LS.attentionFlag ||
            event.key === this.LS.attentionTabId ||
            event.key === this.LS.queue ||
            event.key === this.LS.inflight
        ) {
            void this.flushIfEffectiveLeader();
        }
    }

    private error(error: unknown) {
        if (this.debug) {
            console.log('[notification-broker]', error);
        } else {
            captureException(error);
        }
    }
}
