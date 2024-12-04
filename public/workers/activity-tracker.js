console.log('worker');

const WORKER_EVENTS = {
    CONNECTED: 'CONNECTED',
    ACTIVITY_UPDATE: 'ACTIVITY_UPDATE',
    DISCONNECT: 'DISCONNECT',
    ACTIVITY: 'ACTIVITY',
    VISIBLE_CHANGE: 'VISIBLE_CHANGE',
    ACTIVE_PORT_CHANGE: 'ACTIVE_PORT_CHANGE'
};

class ActivityTracker {
    constructor() {
        this.connections = new Set();
        this.updateTimer = null;
        this.UPDATE_INTERVAL = 2 * 60 * 1000; // 2 minutes
        this.INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes

        this.lastActivityTime = Date.now();
        this.lastActivePort = null;

        self.onconnect = this.handleConnection.bind(this);
        this.startActivityTracking();
    }

    handleConnection(event) {
        const port = event.ports[0];
        this.connections.add(port);

        this.lastActivePort = port;
        this.lastActivityTime = Date.now();

        port.onmessage = e => this.handleMessage(e, port);
        port.postMessage({ type: WORKER_EVENTS.CONNECTED });
    }

    handleMessage(event, port) {
        const { type } = event.data;

        switch (type) {
            case WORKER_EVENTS.DISCONNECT:
                this.handleDisconnect(port);
                break;
            case WORKER_EVENTS.VISIBLE_CHANGE:
                if (event.data.payload.isVisible) {
                    this.setActivePort(port);
                    this.lastActivityTime = Date.now();
                }
                break;
        }
    }

    setActivePort(port) {
        if (this.lastActivePort !== port) this.lastActivePort = port;
        this.broadcastActivePortChange(port);
    }

    handleDisconnect(port) {
        this.connections.delete(port);

        if (this.lastActivePort === port) {
            this.lastActivePort = Array.from(this.connections)[this.connections.size - 1] || null;
        }

        if (this.connections.size === 0) {
            this.stopActivityTracking();
        }
    }

    startActivityTracking() {
        if (!this.updateTimer) {
            this.broadcastActivity();

            this.updateTimer = setInterval(() => {
                this.checkAndBroadcastActivity();
            }, this.UPDATE_INTERVAL);
        }
    }

    stopActivityTracking() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
            this.updateTimer = null;
        }
    }

    checkAndBroadcastActivity() {
        const timeSinceLastActivity = Date.now() - this.lastActivityTime;

        if (timeSinceLastActivity <= this.INACTIVITY_TIMEOUT) {
            this.broadcastActivity();
        } else {
            this.broadcastInactivity();
        }
    }

    broadcastActivity() {
        if (this.lastActivePort) {
            this.lastActivePort.postMessage({
                type: WORKER_EVENTS.ACTIVITY_UPDATE,
                payload: {
                    shouldUpdate: true,
                    isActive: true
                }
            });
        }

        if (this.connections.size > 0) {
            this.connections.forEach(port => {
                if (port !== this.lastActivePort) {
                    port.postMessage({
                        type: WORKER_EVENTS.ACTIVITY_UPDATE,
                        payload: {
                            shouldUpdate: false,
                            isActive: true
                        }
                    });
                }
            });
        }
    }

    broadcastInactivity() {
        this.connections.forEach(port => {
            port.postMessage({
                type: WORKER_EVENTS.ACTIVITY_UPDATE,
                payload: {
                    shouldUpdate: false,
                    isActive: false
                }
            });
        });

        this.stopActivityTracking();
    }

    broadcastActivePortChange(activePort) {
        this.connections.forEach(port => {
            port.postMessage({
                type: WORKER_EVENTS.ACTIVE_PORT_CHANGE,
                payload: {
                    isActivePort: port === activePort
                }
            });
        });
    }
}

new ActivityTracker();
