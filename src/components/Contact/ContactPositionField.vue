<template>
    <span v-if="positionLabel">{{ positionLabel }}</span>
    <span v-else-if="loading">Загрузка..</span>
    <span v-else-if="showWarning" :class="warningClass">{{ warningLabel }}</span>
</template>
<script setup lang="ts">
import { useContactPosition } from '@/composables/useContactPosition';
import { Contact } from '@/types/contact/contact';
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        contact: Contact;
        onlyName?: boolean;
        showWarning?: boolean;
        warningLabel?: string;
        warningClass?: string;
    }>(),
    { warningLabel: 'Должность не заполнена!' }
);

const positionLabel = computed(() => {
    if (props.onlyName) return positionName.value;

    return props.contact.position_unknown ? 'Должность неизвестна' : positionName.value;
});

const { positionName, loading } = useContactPosition(() => props.contact.position_id);
</script>
