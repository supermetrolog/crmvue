import { ref, shallowReactive } from 'vue';
import { createSharedComposable } from '@vueuse/core';
import { isObject } from '@/utils/helpers/object/isObject.js';

export const useConfirm = createSharedComposable(() => {
    let _resolve = null;

    const isVisible = ref(false);

    const defaultOptions = {
        title: null,
        message: null,
        okButton: 'Подтвердить',
        okIcon: 'fa-solid fa-check',
        cancelButton: 'Отмена',
        icon: 'fa-solid fa-hand'
    };

    const content = shallowReactive({
        title: null,
        message: null,
        okButton: defaultOptions.okButton,
        okIcon: defaultOptions.okIcon,
        cancelButton: defaultOptions.cancelButton,
        icon: defaultOptions.icon
    });

    function close(state = false) {
        isVisible.value = false;

        if (_resolve) {
            _resolve(state);
            _resolve = null;
        }

        content.title = null;
        content.message = null;
    }

    function submit() {
        close(true);
    }

    function cancel() {
        close();
    }

    async function confirm(titleOrConfig, message = null) {
        if (isObject(titleOrConfig)) {
            content.title = titleOrConfig.title;
            content.message = titleOrConfig.message;

            content.okButton = titleOrConfig.okButton ?? defaultOptions.okButton;
            content.cancelButton = titleOrConfig.cancelButton ?? defaultOptions.cancelButton;
            content.okIcon = titleOrConfig.okIcon ?? defaultOptions.okIcon;
            content.icon = titleOrConfig.icon ?? defaultOptions.icon;
        } else {
            content.title = titleOrConfig;
            content.message = message;

            content.okButton = defaultOptions.okButton;
            content.cancelButton = defaultOptions.cancelButton;
            content.okIcon = defaultOptions.okIcon;
            content.icon = defaultOptions.icon;
        }

        isVisible.value = true;

        return new Promise(res => {
            _resolve = res;
        });
    }

    return { confirm, cancel, submit, isVisible, content };
});
