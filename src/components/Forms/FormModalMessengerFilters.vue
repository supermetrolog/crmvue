<template>
    <Modal @close="$emit('close')" show width="600" title="Настройка фильтров">
        <component :is="currentFiltersComponent" v-model="modelValue" />
        <template #footer>
            <Button @click="$emit('close')" small>Закрыть</Button>
            <Button @click="clear" :disabled="!hasFilters" danger small>Очистить фильтры</Button>
        </template>
    </Modal>
</template>
<script setup>
import Modal from '@/components/common/Modal.vue';
import { computed } from 'vue';
import { useStore } from 'vuex';
import { messenger } from '@/const/messenger.js';
import MessengerAsideFiltersForConsultants from '@/components/Messenger/Aside/Filters/MessengerAsideFiltersForConsultants.vue';
import MessengerAsideFiltersForObjects from '@/components/Messenger/Aside/Filters/MessengerAsideFiltersForObjects.vue';
import Button from '@/components/common/Button.vue';

const COMPONENTS = {
    [messenger.tabs.OBJECTS]: MessengerAsideFiltersForObjects,
    [messenger.tabs.REQUESTS]: MessengerAsideFiltersForObjects,
    [messenger.tabs.COMPANIES]: MessengerAsideFiltersForObjects,
    [messenger.tabs.USERS]: MessengerAsideFiltersForConsultants
};

const modelValue = defineModel();
defineEmits(['close']);

const store = useStore();

const hasFilters = computed(() => {
    return Object.values(modelValue.value).filter(Boolean).length;
});

const clear = () => {
    modelValue.value = {};
};

const currentFiltersComponent = computed(() => {
    if (store.state.Messenger.currentAsidePanel)
        return COMPONENTS[store.state.Messenger.currentAsidePanel];
    return COMPONENTS[messenger.tabs.OBJECTS];
});
</script>
