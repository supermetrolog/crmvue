import { computed, ref } from 'vue';

/**
 * @description Текущие созданные Popup's.
 * @type {Ref<UnwrapRef<{}>>}
 */
const POPUPS_LIST = ref({});

const _show = async (key, props) => {
    if (!POPUPS_LIST.value[key]) return;

    POPUPS_LIST.value[key].isVisible = true;
    POPUPS_LIST.value[key].props = props;
    POPUPS_LIST.value[key].onShowed();

    return new Promise(res => {
        POPUPS_LIST.value[key].resolve = res;
    });
};

const close = (key, state) => {
    POPUPS_LIST.value[key].isVisible = false;
    POPUPS_LIST.value[key].props = null;

    if (POPUPS_LIST.value[key].resolve) {
        POPUPS_LIST.value[key].resolve(state);
        POPUPS_LIST.value[key].resolve = null;
    }
};

const _cancel = key => close(key);

const _submit = (key, state) => close(key, state);

const createPopup = name => {
    POPUPS_LIST.value[name] = {
        isVisible: false,
        onShowed: () => {},
        resolve: null
    };
};

const _destroy = name => {
    delete POPUPS_LIST.value[name];
};

const _onShowed = (key, hook) => {
    POPUPS_LIST.value[key].onShowed = hook;
};

export function useAsyncPopup(name) {
    if (!POPUPS_LIST.value[name]) createPopup(name);

    /**
     * @function show
     * @description Открыть `Popup` с переданными `props`.
     *
     * @param {Object} props - `Props` для `Popup`
     * @returns {Promise<*>} - Промис зарезолвится, когда Popup будет закрыт с помощью `cancel` или `submit`.
     */
    const show = props => _show(name, props);

    /**
     * @function onPopupShowed
     * @description Хук жизненного цикла `Popup`. Вызывается в момент открытия.
     *
     * @param {function} hook - Функция для вызова в момент открытия
     */
    const onPopupShowed = hook => _onShowed(name, hook);

    /**
     * @function cancel
     * @description Закрыть `Popup` без результата.
     */
    const cancel = () => _cancel(name);

    /**
     * @function submit
     * @description Закрыть `Popup` с переданным результатом.
     *
     * @param {*} state - Результат работы `Popup`
     */
    const submit = (state = true) => _submit(name, state);

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
        cancel,
        submit,
        destroy,
        props,
        isVisible
    };
}
