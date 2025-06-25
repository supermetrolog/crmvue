<template>
    <UiDropdownActions title="Действия над запросом">
        <template #trigger>
            <UiButton
                small
                color="white"
                :loading
                :icon="isDisabled ? 'fa-solid fa-ban' : undefined"
            >
                <span>Запрос #{{ request.id }}</span>
                <i class="fa-solid fa-pen ml-2 text-grey" />
            </UiButton>
        </template>
        <template #menu>
            <UiDropdownActionsGroup>
                <UiDropdownActionsButton
                    @handle="$emit('edit')"
                    label="Редактировать"
                    icon="fa-solid fa-pen"
                />
                <template v-if="!isDone">
                    <UiDropdownActionsButton
                        v-if="isDisabled"
                        @handle="$emit('enable')"
                        label="Восстановить"
                        icon="fa-solid fa-undo"
                    />
                    <UiDropdownActionsButton
                        v-else
                        @handle="$emit('disable')"
                        label="В пассив"
                        icon="fa-solid fa-ban"
                    />
                </template>
                <UiCan moderator-or-higher>
                    <UiDropdownActionsButton
                        v-if="!isDone"
                        @handle="$emit('change-consultant')"
                        label="Изменить консультанта"
                        icon="fa-solid fa-user-tag"
                    />
                    <UiDropdownActionsButton
                        @handle="$emit('clone')"
                        label="Клонировать"
                        icon="fa-solid fa-clone"
                    />
                </UiCan>
            </UiDropdownActionsGroup>
            <UiDropdownActionsGroup>
                <UiDropdownActionsButton
                    @handle="$emit('show')"
                    label="Подробнее"
                    icon="fa-solid fa-eye"
                />
            </UiDropdownActionsGroup>
        </template>
    </UiDropdownActions>
</template>

<script setup lang="ts">
import UiButton from '@/components/common/UI/UiButton.vue';
import UiCan from '@/components/common/UI/UiCan.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import { computed } from 'vue';
import UiDropdownActionsGroup from '@/components/common/UI/DropdownActions/UiDropdownActionsGroup.vue';

defineEmits<{
    (e: 'show'): void;
    (e: 'edit'): void;
    (e: 'disable'): void;
    (e: 'enable'): void;
    (e: 'change-consultant'): void;
    (e: 'clone'): void;
}>();

const props = defineProps({
    request: {
        type: Object,
        required: true
    },
    loading: Boolean
});

const isDisabled = computed(() => props.request.status === 0);
const isDone = computed(() => props.request.status === 2);
</script>
