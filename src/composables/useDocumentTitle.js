import { config } from '@/configs/config.js';

const TITLE_SEPARATOR = '|';

function setTitle(value = null) {
    if (Array.isArray(value)) {
        document.title = [...value, config.title].join(` ${TITLE_SEPARATOR} `);
        return;
    }

    if (typeof value === 'string') {
        document.title = (value ? `${value} ${TITLE_SEPARATOR} ` : '') + config.title;
        return;
    }

    document.title = config.title;
}

export function useDocumentTitle() {
    return { setTitle };
}
