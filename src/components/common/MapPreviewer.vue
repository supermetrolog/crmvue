<template>
    <UiModal
        v-model:visible="isOpened"
        @closed="onClosed"
        class="modal-previewer"
        title="Просмотр объекта на карте"
        :width="1400"
    >
        <UiField v-if="isNotFound">Объект не найден..</UiField>
        <OfferYmap
            :loading="isLoading"
            :selected
            :list="currentList"
            :styles="{ width: '100%', height: '80vh' }"
        />
    </UiModal>
</template>
<script setup>
import { ref, shallowRef } from 'vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import OfferYmap from '@/components/Offer/OfferYmap.vue';
import api from '@/api/api.js';
import UiField from '@/components/common/UI/UiField.vue';

const isOpened = ref(false);
const isLoading = ref(false);
const isNotFound = ref(false);

const currentList = shallowRef([]);
const selected = shallowRef(null);

async function fetchObject(objectId) {
    isLoading.value = true;

    try {
        const response = await api.object.search({ id: objectId });

        if (response.data.length) {
            currentList.value = response.data;
            selected.value = response.data[0].id;
        } else {
            isNotFound.value = true;
        }
    } finally {
        isLoading.value = false;
    }
}

function open(payload = {}) {
    selected.value = payload.selected;
    currentList.value = payload.list ?? [];

    if (payload.objectId) {
        fetchObject(payload.objectId);
    }

    isOpened.value = true;
}

function onClosed() {
    currentList.value = [];
    selected.value = null;

    isNotFound.value = false;
    isLoading.value = false;
}

defineExpose({ open });
</script>
