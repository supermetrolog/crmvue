<template>
    <RequestRowCard @open-timeline="$emit('open-timeline')" :request="request" full linked-timeline>
        <template v-if="!readOnly" #menu>
            <UiDropdownActionsGroup>
                <UiDropdownActionsButton
                    @handle="$emit('create-task')"
                    icon="fa-solid fa-bolt"
                    label="Создать задачу"
                />
                <UiDropdownActionsButton
                    v-if="isActive && canBeDisabled"
                    @handle="$emit('to-passive')"
                    icon="fa-solid fa-ban"
                    label="В пассив"
                />
            </UiDropdownActionsGroup>
            <UiDropdownActionsGroup>
                <UiDropdownActionsButton
                    @handle="$emit('open-timeline')"
                    icon="fa-solid fa-timeline"
                    label="Открыть таймлайн"
                />
            </UiDropdownActionsGroup>
        </template>
    </RequestRowCard>
</template>

<script setup>
import RequestRowCard from '@/components/RequestRowCard/RequestRowCard.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import { computed } from 'vue';
import { useAuth } from '@/composables/useAuth.js';
import UiDropdownActionsGroup from '@/components/common/UI/DropdownActions/UiDropdownActionsGroup.vue';

defineEmits(['open-timeline', 'create-task', 'to-passive']);
const props = defineProps({
    request: {
        type: Object,
        required: true
    },
    readOnly: Boolean
});

const { currentUserId, currentUserIsModeratorOrHigher } = useAuth();

const canBeDisabled = computed(
    () =>
        currentUserIsModeratorOrHigher.value || currentUserId.value === props.request.consultant_id
);

const isActive = computed(() => props.request.status === 1);
</script>
