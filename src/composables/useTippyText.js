import { useTippy } from 'vue-tippy';

export function useTippyText(el, content) {
    return useTippy(el, { content: content });
}
