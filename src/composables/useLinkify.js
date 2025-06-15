import { computed, ref, toValue, watch } from 'vue';
import { tryOnScopeDispose, unrefElement, useClipboard, useEventListener } from '@vueuse/core';
import { useNotify } from '@/utils/use/useNotify.js';
import linkifyHtml from 'linkify-html';
import { find as linkifyFind } from 'linkifyjs';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';

let lastCopiedNode = null;

function render({ tagName, attributes, content }) {
    let attribute = '';

    for (const attr in attributes) {
        attribute += ` ${attr}=${attributes[attr]}`;
    }

    return `<span class="ui-linkify">
                <button class="ui-linkify__button" title="Копировать ссылку"><i class="fa-regular fa-copy"></i></button><${tagName}${attribute}>${content}</${tagName}></span>`;
}

export function useLinkify(text, target, options = {}) {
    const { copy } = useClipboard();
    const notify = useNotify();

    const localeOptions = {
        target: '_blank',
        truncate: 40,
        className: 'ui-linkify__link',
        findLinks: false,
        render,
        ...toValue(options)
    };

    const _target = computed(() => unrefElement(target));

    const textWithLinks = computed(() => {
        const textValue = toValue(text);

        if (isNotNullish(textValue)) {
            return linkifyHtml(textValue, localeOptions);
        }

        return null;
    });

    const links = ref([]);

    function findLinks() {
        links.value = linkifyFind(toValue(text));
    }

    function clearLinks() {
        links.value = [];
    }

    const hasLinks = computed(() => links.value.length > 0);

    const stop = watch(
        () => [_target.value, textWithLinks.value],
        ([targetValue, textValue]) => {
            if (isNullish(targetValue)) return;

            targetValue.innerHTML = textValue;

            if (localeOptions.findLinks) {
                if (textWithLinks.value !== text) {
                    findLinks();
                } else {
                    clearLinks();
                }
            }
        }
    );

    function handleLinkClick(event) {
        if (event.target.tagName === 'BUTTON') {
            const content = event.target.nextElementSibling.href;

            if (event.target.classList.contains('copied')) {
                notify.info('Ссылка уже скопирована');
            } else {
                copy(content);
                notify.info('Ссылка успешно скопирована');

                if (lastCopiedNode) lastCopiedNode.classList.remove('copied');
                event.target.classList.add('copied');

                lastCopiedNode = event.target;
            }

            event.preventDefault();
        }
    }

    useEventListener(target, 'click', handleLinkClick);

    tryOnScopeDispose(() => {
        stop();
    });

    return { textWithLinks, links, hasLinks };
}
