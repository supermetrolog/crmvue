import { shallowReactive } from 'vue';
import { spliceById } from '@/utils/helpers/array/spliceById.js';

const modals = shallowReactive([]);

let uid = 0;

function generateId() {
    uid++;

    return uid;
}

function expandModal(modal) {
    if (typeof modal.expandHandler === 'function') modal.expandHandler();

    spliceById(modals, modal.id);
}

function minimizeModal(title, closeHandler, expandHandler) {
    const id = generateId();

    modals.push({ id, title, closeHandler, expandHandler });

    return id;
}

function closeModal(modal) {
    if (typeof modal.closeHandler === 'function') modal.closeHandler();
    spliceById(modals, modal.id);
}

export function getMinimizedModalManager() {
    return {
        modals,
        minimizeModal,
        expandModal,
        closeModal
    };
}

export function useMinimizedModalManager() {
    return {
        minimizeModal
    };
}
