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

    private subscriptions: Array<() => void> = [];

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

    publishFromWS(notification: IncomingNotification) {
        this.enqueue(notification);

        void this.flushIfEffectiveLeader();
    }

    changeUserId(userId: number) {
        this.userId = userId;

        this.LS = {
            queue: `notify.${this.userId}.queue`,
            seen: `notify.${this.userId}.seen`,
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

    private readSeen(): Record<number, true> {
        try {
            return JSON.parse(getFromLocalstorage(this.LS.seen) || '{}');
        } catch (error) {
            this.error(error);

            return {};
        }
    }

    private writeSeen(map: Record<number, true>) {
        setInLocalstorage(this.LS.seen, JSON.stringify(map));
    }

    private enqueue(notification: IncomingNotification) {
        const queue = this.readQueue();

        if (!queue.ids.includes(notification.notification_id)) {
            queue.ids.push(notification.notification_id);
            queue.items.push(notification);

            this.writeQueue(queue);
        }
    }

    private isEffectiveLeaderNow() {
        return (
            this.leadership.getIsLeader() &&
            getFromLocalstorage(this.LS.attentionFlag) === 'true' &&
            getFromLocalstorage(this.LS.attentionTabId) === this.leadership.getTabId()
        );
    }

    private async flushIfEffectiveLeader() {
        if (!this.isEffectiveLeaderNow()) return;

        const queue = this.readQueue();
        if (!queue.items.length) return;

        this.writeQueue({ ids: [], items: [] });

        const seen = this.readSeen();

        for (const notification of queue.items) {
            if (seen[notification.notification_id]) continue;

            await this.display(notification);

            seen[notification.notification_id] = true;
        }

        this.writeSeen(seen);
    }

    private onStorage(event: StorageEvent) {
        if (!event.key) return;

        if (
            event.key === this.LS.leaderTabId ||
            event.key === this.LS.attentionFlag ||
            event.key === this.LS.attentionTabId ||
            event.key === this.LS.queue
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
