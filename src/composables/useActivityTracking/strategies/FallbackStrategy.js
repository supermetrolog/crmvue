import { BaseTrackingStrategy } from '@/composables/useActivityTracking/strategies/BaseTrackingStrategy.js';

export class FallbackStrategy extends BaseTrackingStrategy {
    constructor(onError, onConnectionChange, onActivity) {
        super(onError);
        this.onConnectionChange = onConnectionChange;
        this.onActivity = onActivity;

        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    }

    initialize() {
        this.onConnectionChange(true);
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        this.startActivityTracking();
    }

    handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
            this.startActivityTracking();
        } else {
            this.stopActivityTracking();
        }
    }

    startActivityTracking() {
        this.reportActivity();

        if (!this.updateTimer) {
            this.updateTimer = setInterval(() => {
                this.reportActivity();
            }, this.UPDATE_INTERVAL);
        }
    }

    stopActivityTracking() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
            this.updateTimer = null;
        }
    }

    reportActivity() {
        this.onActivity({
            lastActivityAt: Date.now()
        });
    }

    cleanup() {
        this.stopActivityTracking();
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
}
