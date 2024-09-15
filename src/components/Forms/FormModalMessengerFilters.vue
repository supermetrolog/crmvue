<template>
    <Modal @close="$emit('close')" show width="900" title="Настройка фильтров">
        <component :is="currentFiltersComponent" v-model="localeModelValue" />
        <template #footer>
            <MessengerButton @click="apply" color="success">Применить</MessengerButton>
            <MessengerButton @click="$emit('close')">Отмена</MessengerButton>
            <MessengerButton @click="clear" :disabled="!hasFilters" color="danger">
                Очистить фильтры
            </MessengerButton>
        </template>
    </Modal>
</template>
<script setup>
import Modal from '@/components/common/Modal.vue';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import { computed, onBeforeMount, ref } from 'vue';
import { useStore } from 'vuex';
import { messenger } from '@/const/messenger.js';
import MessengerAsideFiltersForConsultants from '@/components/Messenger/Aside/Filters/MessengerAsideFiltersForConsultants.vue';
import MessengerAsideFiltersForObjects from '@/components/Messenger/Aside/Filters/MessengerAsideFiltersForObjects.vue';

const COMPONENTS = {
    [messenger.tabs.OBJECTS]: MessengerAsideFiltersForObjects,
    [messenger.tabs.REQUESTS]: MessengerAsideFiltersForObjects,
    [messenger.tabs.USERS]: MessengerAsideFiltersForConsultants
};

const store = useStore();

const modelValue = defineModel({ type: Array, default: () => [] });
const localeModelValue = ref([]);

const hasFilters = computed(() => localeModelValue.value.length || modelValue.value.length);

const clear = () => {
    modelValue.value = [];
    localeModelValue.value = [];
};

const apply = () => {
    modelValue.value = localeModelValue.value;
};

const currentFiltersComponent = computed(() => {
    if (store.state.Messenger.currentAsidePanel)
        return COMPONENTS[store.state.Messenger.currentAsidePanel];
    return COMPONENTS[messenger.tabs.OBJECTS];
});

onBeforeMount(() => {
    if (modelValue.value.length) localeModelValue.value = modelValue.value;
});
</script>
