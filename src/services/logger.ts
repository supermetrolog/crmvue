export interface LoggerOptions {
    prefix: string;
    enabled: boolean;
}

export class Logger {
    private prefix: string;
    private enabled: boolean;

    constructor(options: LoggerOptions) {
        this.prefix = options.prefix;
        this.enabled = options.enabled;
    }

    private formatMessage(msg: any, ...args: any[]) {
        return [`[${this.prefix}]`, msg, ...args];
    }

    private shouldBeLogged() {
        return this.enabled;
    }

    debug(msg: any, ...args: any[]) {
        if (this.shouldBeLogged()) {
            console.debug(...this.formatMessage(msg, ...args));
        }
    }

    info(msg: any, ...args: any[]) {
        if (this.shouldBeLogged()) {
            console.info(...this.formatMessage(msg, ...args));
        }
    }

    warn(msg: any, ...args: any[]) {
        if (this.shouldBeLogged()) {
            console.warn(...this.formatMessage(msg, ...args));
        }
    }

    error(msg: any, ...args: any[]) {
        if (this.shouldBeLogged()) {
            console.error(...this.formatMessage(msg, ...args));
        }
    }
}
