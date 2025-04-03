<template>
    <UiModal v-model:visible="isVisible" @close="$emit('close')" custom-close :width="550" :title>
        <FormCompanyRequestDisable @disabled="$emit('disabled')" :request_id="request_id" />
    </UiModal>
</template>

<script setup>
import FormCompanyRequestDisable from '@/components/Forms/Company/FormCompanyRequestDisable.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import { computed } from 'vue';

defineEmits(['close', 'disabled']);
const props = defineProps({
    title: {
        type: String,
        default: 'Завершение запроса'
    },
    request_id: Number,
    show: Boolean
});

const isVisible = computed({
    get() {
        return props.show;
    },
    set() {}
});
</script>
