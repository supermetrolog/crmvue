import { inject, InjectionKey, provide, Reactive, reactive, toRaw, toValue } from 'vue';
import { MaybeRefOrGetter, useDebounceFn } from '@vueuse/core';
import {
    ColumnWidths,
    readColumnWidths,
    writeColumnWidths
} from '@/components/common/Table/storage';

export type TableColumnWidthContext = {
    resizable: MaybeRefOrGetter<boolean>;
    getColWidth: (key: string) => number | undefined;
    setColWidth: (key: string, px: number) => void;
    resetColWidth: (key: string) => void;
    constraints?: MaybeRefOrGetter<Record<string, { min?: number; max?: number }>>;
    widths: Reactive<ColumnWidths>;
};

export type CreateTableColumnWidthContextOptions = {
    resizable: MaybeRefOrGetter<boolean>;
    storageKey: MaybeRefOrGetter<string>;
    defaultWidths?: MaybeRefOrGetter<ColumnWidths | undefined>;
    constraints?: MaybeRefOrGetter<Record<string, { min?: number; max?: number }>>;
};

const injectionKey: InjectionKey<TableColumnWidthContext> = Symbol('table-column-width-context');

export function createTableColumnWidthContext(options: CreateTableColumnWidthContextOptions) {
    const { storageKey, defaultWidths = {}, constraints = {}, resizable } = options;

    const debouncedWriteColumnWidths = useDebounceFn(writeColumnWidths, 600);

    const widths = reactive<ColumnWidths>({
        ...(toValue(defaultWidths) ?? {}),
        ...readColumnWidths(toValue(storageKey))
    });

    function getColWidth(key: string): number | undefined {
        return widths[key];
    }

    function setColWidth(key: string, px: number) {
        const { min, max } = toValue(constraints)?.[key] ?? {};

        widths[key] = Math.max(min ?? 40, max ? Math.min(max, px) : px);

        void debouncedWriteColumnWidths(toValue(storageKey), toRaw(widths));
    }

    function resetColWidth(key: string) {
        const _defaultWidths = toValue(defaultWidths);

        if (_defaultWidths?.[key] != null) {
            widths[key] = _defaultWidths[key];
        } else {
            delete widths[key];
        }
    }

    provide(injectionKey, {
        getColWidth,
        setColWidth,
        resetColWidth,
        constraints,
        resizable,
        widths
    });

    return {
        widths
    };
}

export function useTableColumnWidth() {
    return inject(injectionKey)!;
}
