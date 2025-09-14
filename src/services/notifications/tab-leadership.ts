import { getFromLocalstorage, setInLocalstorage } from '@/services/localStorage';

export type LeadershipOptions = {
    userId: number;
    settleMs?: number;
    debug?: boolean;
};

export class TabLeadershipService {
    private userId: number;
    private settleMs: number;
    private debug: boolean;

    private readonly LS: Record<string, string>;
    private readonly tabId: string;

    private isLeader = false;
    private isFocused = false;
    private isVisible = document.visibilityState === 'visible';
    private attentionTimer: number | null = null;
    private started = false;

    private leaderSubs: Array<(isLeader: boolean) => void> = [];
    private attentionSubs: Array<(amAttention: boolean) => void> = [];
    private lastAttention: boolean = document.hasFocus() && document.visibilityState === 'visible';

    constructor(opts: LeadershipOptions) {
        this.userId = opts.userId;
        this.settleMs = opts.settleMs ?? 7000;
        this.debug = !!opts.debug;

        this.LS = {
            leaderTabId: `notify.${this.userId}.leaderTabId`,
            attentionTabId: `notify.${this.userId}.attentionTabId`,
            attentionFlag: `notify.${this.userId}.attentionFlag`
        };

        const tabIdKey = `notify.tabId`;

        const existing = sessionStorage.getItem(tabIdKey);

        this.tabId =
            existing ??
            crypto?.randomUUID?.() ??
            `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;

        if (!existing) sessionStorage.setItem(tabIdKey, this.tabId);

        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onVisibility = this.onVisibility.bind(this);
        this.onStorage = this.onStorage.bind(this);
    }

    start() {
        if (this.started) return;
        this.started = true;

        this.isFocused = document.hasFocus();
        this.isVisible = document.visibilityState === 'visible';
        this.lastAttention = this.amAttention();

        window.addEventListener('focus', this.onFocus, false);
        window.addEventListener('blur', this.onBlur, false);
        document.addEventListener('visibilitychange', this.onVisibility, false);
        window.addEventListener('storage', this.onStorage, false);

        this.updateIsLeader();
        if (this.amAttention()) this.onAttentionGain();

        this.emitLeader();
        this.emitAttention();
    }

    stop() {
        if (!this.started) return;
        this.started = false;

        this.clearSettleTimer();
        window.removeEventListener('focus', this.onFocus);
        window.removeEventListener('blur', this.onBlur);
        document.removeEventListener('visibilitychange', this.onVisibility);
        window.removeEventListener('storage', this.onStorage);
    }

    getIsLeader() {
        return this.isLeader;
    }

    isEffectiveLeader() {
        return this.isLeader && this.amAttention();
    }

    getTabId() {
        return this.tabId;
    }

    onLeaderChange(cb: (isLeader: boolean) => void) {
        this.leaderSubs.push(cb);

        cb(this.isLeader);

        return () => {
            this.leaderSubs = this.leaderSubs.filter(x => x !== cb);
        };
    }

    onAttentionChange(cb: (amAttention: boolean) => void) {
        this.attentionSubs.push(cb);

        cb(this.lastAttention);

        return () => {
            this.attentionSubs = this.attentionSubs.filter(x => x !== cb);
        };
    }

    private emitLeader() {
        for (const cb of this.leaderSubs) {
            cb(this.isLeader);
        }
    }

    private emitAttention() {
        for (const cb of this.attentionSubs) {
            cb(this.lastAttention);
        }
    }

    private amAttention() {
        return this.isFocused && this.isVisible;
    }

    private refreshAttentionAndEmit() {
        const nowAttention = this.amAttention();

        if (nowAttention !== this.lastAttention) {
            this.lastAttention = nowAttention;
            this.emitAttention();
        }
    }

    private log(...a: any[]) {
        if (this.debug) {
            console.log('[tab-leadership]', ...a);
        }
    }

    private attentionTabId() {
        return getFromLocalstorage(this.LS.attentionTabId);
    }

    private attentionFlag() {
        return getFromLocalstorage(this.LS.attentionFlag) === 'true';
    }

    private currentLeaderId() {
        return getFromLocalstorage(this.LS.leaderTabId);
    }

    private setLeader(id: string) {
        setInLocalstorage(this.LS.leaderTabId, id);

        this.updateIsLeader();

        this.log('setLeader', id);
    }

    private clearAttentionIfMine() {
        if (this.attentionTabId() === this.tabId) {
            setInLocalstorage(this.LS.attentionFlag, 'false');
        }
    }

    private markAttentionMine() {
        setInLocalstorage(this.LS.attentionTabId, this.tabId);
        setInLocalstorage(this.LS.attentionFlag, 'true');
    }

    private updateIsLeader() {
        const was = this.isLeader;

        this.isLeader = this.currentLeaderId() === this.tabId;

        if (this.isLeader !== was) this.emitLeader();
    }

    private onFocus() {
        this.isFocused = true;

        this.refreshAttentionAndEmit();

        if (this.amAttention()) {
            this.onAttentionGain();
        }
    }

    private onBlur() {
        this.isFocused = false;

        this.refreshAttentionAndEmit();

        this.onAttentionLose();
    }

    private onVisibility() {
        this.isVisible = document.visibilityState === 'visible';

        this.refreshAttentionAndEmit();

        if (this.amAttention()) this.onAttentionGain();
        else this.onAttentionLose();
    }

    private onStorage(ev: StorageEvent) {
        if (!ev.key) return;

        if (ev.key === this.LS.leaderTabId) {
            this.updateIsLeader();
        }
    }

    private onAttentionGain() {
        this.markAttentionMine();

        if (this.attentionFlag()) {
            this.setLeader(this.tabId);
            this.clearSettleTimer();
            return;
        }

        this.scheduleSettleClaim();
    }

    private onAttentionLose() {
        this.clearSettleTimer();
        this.clearAttentionIfMine();
    }

    private scheduleSettleClaim() {
        this.clearSettleTimer();

        this.attentionTimer = window.setTimeout(() => {
            if (this.amAttention()) {
                this.setLeader(this.tabId);
            }

            this.attentionTimer = null;
        }, this.settleMs);
    }

    private clearSettleTimer() {
        if (this.attentionTimer) {
            clearTimeout(this.attentionTimer);
            this.attentionTimer = null;
        }
    }
}
