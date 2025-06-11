<template>
    <RequestRowCard @open-timeline="$emit('open-timeline')" :request="request" full linked-timeline>
        <template #menu>
            <UiDropdownActionsButton
                @handle="$emit('open-timeline')"
                icon="fa-solid fa-timeline"
                label="Открыть таймлайн"
            />
            <UiDropdownActionsButton
                @handle="$emit('create-task')"
                icon="fa-solid fa-bolt"
                label="Создать задачу"
            />
        </template>
    </RequestRowCard>
</template>

<script setup>
import RequestRowCard from '@/components/RequestRowCard/RequestRowCard.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';

defineEmits(['open-timeline', 'create-task']);
defineProps({
    request: {
        type: Object,
        required: true
    }
});
</script>
