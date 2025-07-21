<template>
    <div class="d-flex flex-column gap-2 align-items-center">
        <UiDropdownActions label="Действия над сделкой" :title small>
            <template #menu>
                <UiDropdownActionsButton
                    @handle="$emit('edit')"
                    icon="fa-solid fa-pen"
                    label="Редактировать"
                />
                <UiDropdownActionsButton
                    @handle="$emit('delete')"
                    icon="fa-solid fa-trash"
                    label="Удалить"
                />
                <a :href="timelineHref" target="_blank" class="text-inherit">
                    <UiDropdownActionsButton
                        label="Открыть таймлайн"
                        icon="fa-solid fa-up-right-from-square"
                    />
                </a>
            </template>
        </UiDropdownActions>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import { useAuth } from '@/composables/useAuth';

defineEmits<{
    (e: 'edit'): void;
    (e: 'delete'): void;
}>();

const props = defineProps<{
    deal: object;
}>();

const title = computed(() => `Сделка #${props.deal.id}`);

const { currentUserId } = useAuth();

const timelineHref = computed(() => {
    return `/companies/${props.deal.company_id}?request_id=${props.deal.request_id}&consultant_id=${currentUserId.value}&step=0`;
});
</script>
