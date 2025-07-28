<template>
    <UiModal
        @close="$emit('close')"
        show
        custom-close
        :title="`Заметки (${company.notes_count}) | ${company.full_name}`"
        :width="700"
        :min-height="250"
    >
        <Spinner v-if="isInitialLoading" class="absolute-center" label="Загрузка заметок" />
        <div v-else class="d-flex flex-column gap-2">
            <Loader v-if="isLoading || isDeleting" class="absolute-center" />
            <MessengerDialogLastMessage
                v-for="note in notes"
                :key="note.id"
                :last-message="note.message"
                class="company-table-item__message w-100"
                column
            >
                <template #after>
                    <UiDropdownActions small label="Действия над сообщением" class="ml-auto">
                        <template #menu>
                            <UiDropdownActionsButton
                                @handle="deleteNote(note.id)"
                                label="Удалить заметку"
                                icon="fa-solid fa-trash"
                            />
                        </template>
                    </UiDropdownActions>
                </template>
            </MessengerDialogLastMessage>
            <EmptyData v-if="notes.length === 0">Заметки отсутствуют</EmptyData>
            <PaginationClassic
                @next="setNextPage"
                :pagination
                :loading="isLoading"
                class="w-100 mt-3"
                :with-description="false"
            />
        </div>
    </UiModal>
</template>

<script setup>
import { onBeforeMount, ref, watch } from 'vue';
import Spinner from '@/components/common/Spinner.vue';
import MessengerDialogLastMessage from '@/components/Messenger/Dialog/MessengerDialogLastMessage.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import api from '@/api/api.js';
import { captureException } from '@sentry/vue';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import { useDebounceFn } from '@vueuse/core';
import EmptyData from '@/components/common/EmptyData.vue';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import { useNotify } from '@/utils/use/useNotify.js';
import Loader from '@/components/common/Loader.vue';

defineEmits(['close']);

const props = defineProps({
    company: {
        type: Object,
        required: true
    }
});

const isLoading = ref(false);
const isInitialLoading = ref(false);

const notes = ref([]);
const pagination = ref(null);

const currentPage = ref(1);

function setNextPage(page) {
    currentPage.value = page;
}

async function fetchNotes() {
    isLoading.value = true;

    try {
        const response = await api.entityMessageLink.search(createQuery());

        notes.value = response.data;
        pagination.value = response.pagination;
    } catch (e) {
        captureException(e);
    } finally {
        isLoading.value = false;
    }
}

function createQuery() {
    return {
        entity_id: props.company.id,
        entity_type: 'company',
        page: currentPage.value,
        kind: 'note'
    };
}

watch(currentPage, useDebounceFn(fetchNotes, 300));

onBeforeMount(async () => {
    isInitialLoading.value = true;
    await fetchNotes();
    isInitialLoading.value = false;
});

const { confirm } = useConfirm();
const notify = useNotify();

const isDeleting = ref(false);

async function deleteNote(id) {
    const confirmed = await confirm(
        'Удалить заметку',
        'Вы действительно хотите безвозвратно удалить заметку?'
    );

    if (!confirmed) return;

    try {
        isDeleting.value = true;

        await api.entityMessageLink.delete(id);

        void fetchNotes();

        if (props.company.note?.id === id) {
            Object.assign(props.company, {
                note: null,
                notes_count: props.company.notes_count - 1
            });
        }

        Object.assign(props.company, { notes_count: props.company.notes_count - 1 });

        notify.success('Заметка успешно удалена');
    } finally {
        isDeleting.value = false;
    }
}
</script>
