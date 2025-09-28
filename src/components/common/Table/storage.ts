import { getFromLocalstorage, setInLocalstorage } from '@/services/localStorage';
import { captureException } from '@sentry/vue';

export type ColumnWidths = Record<string, number>;

const PREFIX = 'ui:table:columns:';

export function readColumnWidths(tableKey: string): ColumnWidths {
    try {
        const raw = getFromLocalstorage(PREFIX + tableKey);
        return raw ? JSON.parse(raw) : {};
    } catch (error) {
        captureException(error);
        return {};
    }
}

export function writeColumnWidths(tableKey: string, widths: ColumnWidths) {
    try {
        setInLocalstorage(PREFIX + tableKey, JSON.stringify(widths));
    } catch (error) {
        captureException(error);
    }
}
