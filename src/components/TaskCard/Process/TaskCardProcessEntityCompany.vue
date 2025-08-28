<template>
    <UiDropdownActions title="Действия над компанией">
        <template #trigger>
            <UiButton
                small
                color="white"
                :loading="loading || company.loading"
                :icon="isDisabled ? 'fa-solid fa-ban' : 'fa-solid fa-industry'"
            >
                <span>
                    {{ companyName }} <span class="text-grey fs-1">(#{{ company.id }})</span>
                </span>
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
                <UiDropdownActionsButton
                    v-if="isDisabled"
                    @handle="$emit('enable')"
                    label="Восстановить"
                    icon="fa-solid fa-undo"
                />
                <UiDropdownActionsButton
                    v-else
                    @handle="$emit('disable')"
                    label="Отправить в корзину"
                    icon="fa-solid fa-ban"
                />
                <UiCan moderator-or-higher>
                    <UiDropdownActionsButton
                        v-if="!isDisabled"
                        @handle="$emit('change-consultant')"
                        label="Изменить консультанта"
                        icon="fa-solid fa-user-tag"
                    />
                </UiCan>
            </UiDropdownActionsGroup>
            <UiDropdownActionsGroup>
                <a :href="companyUrl" target="_blank" class="text-inherit">
                    <UiDropdownActionsButton
                        label="Открыть компанию"
                        icon="fa-solid fa-arrow-up-right-from-square"
                    />
                </a>
            </UiDropdownActionsGroup>
        </template>
    </UiDropdownActions>
</template>

<script setup lang="ts">
import UiButton from '@/components/common/UI/UiButton.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import { computed } from 'vue';
import UiDropdownActionsGroup from '@/components/common/UI/DropdownActions/UiDropdownActionsGroup.vue';
import { getCompanyShortName } from '@/utils/formatters/models/company';
import { useRouter } from 'vue-router';
import UiCan from '@/components/common/UI/UiCan.vue';

defineEmits<{
    (e: 'edit'): void;
    (e: 'disable'): void;
    (e: 'enable'): void;
    (e: 'change-consultant'): void;
}>();

const props = defineProps({
    company: {
        type: Object,
        required: true
    },
    loading: Boolean
});

const companyName = computed(() => getCompanyShortName(props.company));

const isDisabled = computed(() => props.company.status === 0);

const router = useRouter();

const companyUrl = computed(
    () => router.resolve({ name: 'company', params: { id: props.company.id } }).href
);
</script>
