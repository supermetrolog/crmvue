export class BaseTrackingStrategy {
    constructor(onError) {
        this.onError = onError;
        this.updateTimer = null;
        this.UPDATE_INTERVAL = 2 * 60 * 1000; // 2 minutes
    }

    cleanup() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
            this.updateTimer = null;
        }
    }
}
