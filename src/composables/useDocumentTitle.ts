import { config } from '@/configs/config.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';

const TITLE_SEPARATOR = '|';

type DocumentTitle = string | string[];

export function setTitle(value: DocumentTitle | null = null) {
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

export function useDocumentTitle(title: DocumentTitle | null = null) {
    if (isNotNullish(title)) {
        setTitle(title);
    }

    return { setTitle };
}
