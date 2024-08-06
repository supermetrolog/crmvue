import { ref, shallowRef } from 'vue';

/**
 * @description Флаг видимости Popup
 * @type {shallowRef<boolean>}
 */
const isVisible = shallowRef(false);

/**
 * @description Текущее сообщение в Popup
 * @type {Ref<string>}
 */
const message = ref('');

let _resolve = null;

/**
 * @function confirm
 * @async
 * @description Вызов функции откроет Popup с переданным сообщением и будет ожидать ответ пользователя.
 *
 * @param {string} text - Текст для подтверждения пользователя
 * @returns {Promise<boolean>} - ``true``, если действие подтверждено; иначе ``false``
 */
const confirm = async text => {
    message.value = text;
    isVisible.value = true;

    return new Promise(res => {
        _resolve = res;
    });
};

const close = (state = false) => {
    isVisible.value = false;

    if (_resolve) {
        _resolve(state);
        _resolve = null;
    }

    message.value = null;
};

/**
 * @function cancel
 * @description Отменить запрашиваемое подтверждение (не подтверждать и закрыть Popup)
 */
const cancel = () => close();

/**
 * @function submit
 * @description Подтвердить запрашиваемое действие
 */
const submit = () => close(true);

/**
 * @function useConfirm
 * @description ``Composable`` для функционала подтверждения действий.
 */
export function useConfirm() {
    return { confirm, cancel, submit, isVisible, message };
}
