import { BaseTrackingStrategy } from '@/composables/useActivityTracking/strategies/BaseTrackingStrategy.js';

const WORKER_EVENTS = {
    CONNECTED: 'CONNECTED',
    ACTIVITY_UPDATE: 'ACTIVITY_UPDATE',
    DISCONNECT: 'DISCONNECT',
    ACTIVITY: 'ACTIVITY',
    VISIBLE_CHANGE: 'VISIBLE_CHANGE',
    ACTIVE_PORT_CHANGE: 'ACTIVE_PORT_CHANGE'
};
const WORKER_URL = '/workers/activity-tracker.js';
export class SharedWorkerStrategy extends BaseTrackingStrategy {
    constructor(onError, onConnectionChange, onActivity) {
        super(onError);

        this.worker = null;
        this.onConnectionChange = onConnectionChange;
        this.onActivity = onActivity;

        this.isActivePort = false;

        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    }

    initialize() {
        try {
            this.worker = new SharedWorker(WORKER_URL, { name: 'activity-tracker' });
            const port = this.worker.port;

            port.onmessage = event => {
                switch (event.data.type) {
                    case WORKER_EVENTS.CONNECTED: {
                        this.onConnectionChange(true);
                        break;
                    }

                    case WORKER_EVENTS.ACTIVITY_UPDATE: {
                        const { shouldUpdate, isActive } = event.data.payload;

                        if (!isActive) {
                            this.onConnectionChange(false);
                            return;
                        }

                        if (this.isActivePort && shouldUpdate) {
                            this.onActivity();
                        }

                        break;
                    }

                    case WORKER_EVENTS.ACTIVE_PORT_CHANGE:
                        this.isActivePort = event.data.payload.isActivePort;
                        break;
                }
            };

            document.addEventListener('visibilitychange', this.handleVisibilityChange);

            this.reportVisibilityState();
            this.onActivity();

            port.start();
        } catch (err) {
            this.onError(err instanceof Error ? err : new Error('Failed to initialize worker'));
        }
    }

    handleVisibilityChange() {
        this.reportVisibilityState();
    }

    reportVisibilityState() {
        if (this.worker?.port) {
            this.worker.port.postMessage({
                type: WORKER_EVENTS.VISIBLE_CHANGE,
                payload: {
                    isVisible: document.visibilityState === 'visible'
                }
            });
        }
    }

    cleanup() {
        super.cleanup();

        if (this.worker) {
            this.worker.port.postMessage({ type: WORKER_EVENTS.DISCONNECT });
            this.worker.port.close();
            this.worker = null;
        }

        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
}
