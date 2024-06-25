import { computed, ref } from 'vue';

/**
 * @description Текущие созданные Popup's.
 * @type {Ref<UnwrapRef<{}>>}
 */
const POPUPS_LIST = ref({});

const _show = (key, props) => {
    POPUPS_LIST.value[key].isVisible = true;
    POPUPS_LIST.value[key].props = props;
    POPUPS_LIST.value[key].onShowed();
};

const _close = key => {
    POPUPS_LIST.value[key].isVisible = false;
    POPUPS_LIST.value[key].props = null;
};

const createPopup = name => {
    POPUPS_LIST.value[name] = {
        isVisible: false,
        onShowed: () => {}
    };
};

const _destroy = name => {
    delete POPUPS_LIST.value[name];
};

const _onShowed = (key, hook) => {
    POPUPS_LIST.value[key].onShowed = hook;
};

export function usePopup(name) {
    if (!POPUPS_LIST.value[name]) createPopup(name);

    /**
     * @function show
     * @description Открыть `Popup` с переданными `props`.
     *
     * @param {Object} props - `Props` для `Popup`
     */
    const show = props => _show(name, props);

    /**
     * @function close
     * @description Закрыть `Popup`.
     */
    const close = () => _close(name);

    /**
     * @function onPopupShowed
     * @description Хук жизненного цикла `Popup`. Вызывается в момент открытия.
     *
     * @param {function} hook - Функция для вызова в момент открытия
     */
    const onPopupShowed = hook => _onShowed(name, hook);

    /**
     * @function destroy
     * @description Уничтожить данные о `Popup`
     */
    const destroy = () => _destroy(name);

    /**
     * @description Текущие пропсы `Popup`
     * @type {ComputedRef<*>}
     */
    const props = computed(() => POPUPS_LIST.value[name]?.props);

    /**
     * @description Текущее состояние `Popup`
     * @type {ComputedRef<*>}
     */
    const isVisible = computed(() => POPUPS_LIST.value[name]?.isVisible);

    return {
        onPopupShowed,
        show,
        close,
        destroy,
        props,
        isVisible
    };
}
