<template>
    <div>
        <CompanyTableItemSummaryNoteForm
            v-if="isEditMode"
            @confirm="confirmEditing"
            @cancel="isEditMode = false"
            @delete="$emit('delete')"
            :message="note.message.message"
            label="Редактирование заметки"
            deletable
        />
        <UiClamped v-else-if="note" button-class="fs-2">
            <div class="company-table-item-summary-survey__note">
                <UiDropdownActions
                    mini
                    color="light"
                    title="Действия над заметкой"
                    class="mr-1"
                    label="Действия над заметкой"
                >
                    <template #menu>
                        <UiDropdownActionsGroup>
                            <UiDropdownActionsButton
                                @handle="isEditMode = true"
                                label="Редактировать"
                                icon="fa-solid fa-pen"
                            />
                            <UiDropdownActionsButton
                                @handle="$emit('delete')"
                                label="Удалить"
                                icon="fa-solid fa-trash"
                            />
                        </UiDropdownActionsGroup>
                        <UiDropdownActionsGroup>
                            <UiDropdownActionsButton
                                @handle="isCreateMode = true"
                                label="Добавить новую заметку"
                                icon="fa-solid fa-plus"
                            />
                        </UiDropdownActionsGroup>
                    </template>
                </UiDropdownActions>
                <i class="fs-2 mr-1">Заметка: {{ updatedAt }}. {{ authorLabel }}.</i>
                <div
                    ref="comment"
                    class="company-table-item-summary-survey__comment company-table-item-summary-survey__note-content"
                ></div>
            </div>
        </UiClamped>
        <UiButton
            v-else
            @click="isCreateMode = true"
            small
            color="transparent"
            class="company-table-item-summary-survey__create-note fs-2"
            icon="fa-solid fa-plus"
        >
            добавить заметку
        </UiButton>
        <CompanyTableItemSummaryNoteForm
            v-if="isCreateMode"
            @confirm="confirmCreating"
            @cancel="isCreateMode = false"
            label="Новая заметка"
            class="mt-1"
        />
        <UiButton
            v-if="total > 1"
            @click="$emit('show-all')"
            mini
            class="mt-1 py-0"
            color="transparent"
        >
            {{ totalLabel }}
        </UiButton>
    </div>
</template>

<script setup>
import { computed, ref, useTemplateRef } from 'vue';
import { useLinkify } from '@/composables/useLinkify.js';
import UiClamped from '@/components/common/UiClamped.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { toDateFormat } from '@/utils/formatters/date';
import { useAuth } from '@/composables/useAuth.js';
import { UserRoleEnum } from '@/types/user';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import UiDropdownActionsGroup from '@/components/common/UI/DropdownActions/UiDropdownActionsGroup.vue';
import CompanyTableItemSummaryNoteForm from '@/components/Company/Table/Summary/CompanyTableItemSummaryNoteForm.vue';
import { pluralTemplate } from '@/utils/plural.js';

const emit = defineEmits(['delete', 'update', 'create', 'show-all']);
const props = defineProps({
    note: Object,
    total: {
        type: Number,
        default: 0
    }
});

const totalLabel = computed(() => {
    return pluralTemplate('+ еще %s', props.total - 1, '%d заметка', '%d заметки', '%d заметок');
});

const updatedAt = computed(() => {
    return toDateFormat(props.note.message.updated_at, 'D.MM.YY');
});

const { currentUserId } = useAuth();

const authorLabel = computed(() => {
    if (props.note.message.from.model.id === currentUserId.value) {
        return 'Вы';
    }

    if (props.note.message.from.model.role === UserRoleEnum.SYSTEM) {
        return 'Система';
    }

    return props.note.message.from.model.userProfile.short_name;
});

useLinkify(
    computed(() => props.note?.message?.message),
    useTemplateRef('comment')
);

// edit

const isEditMode = ref(false);
const isCreateMode = ref(false);

function confirmCreating(message) {
    isCreateMode.value = false;

    emit('create', { message });
}

function confirmEditing(message) {
    isEditMode.value = false;

    emit('update', {
        message,
        tag_ids: [],
        contact_ids: []
    });
}
</script>
