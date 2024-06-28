<template>
    <PhoneNumberModal
        v-if="isVisible"
        @close="cancel"
        @created-contact="props.destroy"
        :phone="props.phone"
        :contact="props.contact"
        :class-list="props.classList"
        :read-only="props.readOnly"
    />
</template>

<script setup>
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import PhoneNumberModal from '@/components/common/PhoneNumberModal.vue';
import { onUnmounted } from 'vue';

const { isVisible, props, destroy, cancel } = useAsyncPopup('PhoneNumber');

onUnmounted(() => {
    destroy();
});
</script>
