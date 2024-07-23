<template>
    <Modal v-if="isOpened" @close="close" :title="title || 'Выбор даты и времени'">
        <DatePicker v-model="date" @select="select" :markers="markers" />
    </Modal>
</template>
<script setup>
import Modal from '@/components/common/Modal.vue';
import DatePicker from '@/components/common/Forms/DatePicker/DatePicker.vue';
import { ref, shallowRef } from 'vue';

const isOpened = shallowRef(false);
const date = ref(null);
const title = ref(null);
const markers = ref([]);

let promiseController = null;

const open = (options = { date: null, title: null }) => {
    date.value = options.date;
    title.value = options.title;

    let resolve, reject;
    const promise = new Promise((ok, fail) => {
        resolve = ok;
        reject = fail;
    });

    promiseController = { resolve, reject };
    isOpened.value = true;

    return promise;
};

const close = () => {
    promiseController.resolve(false);
    isOpened.value = false;
    promiseController = null;
};

const select = () => {
    promiseController.resolve(date.value);
    isOpened.value = false;
};

defineExpose({ open });
</script>
