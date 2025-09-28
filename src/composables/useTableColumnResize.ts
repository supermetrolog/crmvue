import { onBeforeUnmount } from 'vue';
import { noop } from '@vueuse/core';

type DragState = {
    startX: number;
    startWidth: number;
    colKey: string;
};

export type UseTableColumnResizeOptions = {
    onStart?: (payload: { col: string; startWidth: number }) => void;
    onResize?: (payload: { col: string; width: number }) => void;
    onEnd?: (payload: { col: string; width: number }) => void;
};

export function useTableColumnResize(options: UseTableColumnResizeOptions = {}) {
    let dragging: DragState | null = null;

    const { onStart = noop, onResize = noop, onEnd = noop } = options;

    function start(e: MouseEvent, col: string, startWidth: number) {
        e.preventDefault();

        dragging = { startX: e.clientX, startWidth, colKey: col };

        onStart({ col, startWidth });

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);

        document.body.style.cursor = 'col-resize';

        document.body.classList.add('resizing-col');
    }

    function onMove(e: MouseEvent) {
        if (!dragging) return;

        const dx = e.clientX - dragging.startX;

        const width = Math.max(40, Math.round(dragging.startWidth + dx));

        onResize({ col: dragging.colKey, width });
    }

    function onUp() {
        if (!dragging) return;

        onEnd({ col: dragging.colKey, width: 0 });

        dragging = null;

        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);

        document.body.style.cursor = '';

        document.body.classList.remove('resizing-col');
    }

    onBeforeUnmount(() => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
    });

    return { start };
}
