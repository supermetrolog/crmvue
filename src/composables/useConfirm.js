import { ref } from 'vue';

const isVisible = ref(false);
const message = ref(null);

let _resolve = null;

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

const cancel = () => close();
const submit = () => close(true);

export function useConfirm() {
    return { confirm, cancel, submit, isVisible, message };
}
