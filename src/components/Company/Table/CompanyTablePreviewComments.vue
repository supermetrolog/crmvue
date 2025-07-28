<template>
    <UiModal
        @close="$emit('close')"
        show
        custom-close
        :title="`Комментарии (${company.comments_count}) | ${company.full_name}`"
        :width="700"
        :min-height="250"
    >
        <Spinner v-if="isInitialLoading" class="absolute-center" label="Загрузка комментариев" />
        <div v-else class="d-flex flex-column gap-2">
            <Loader v-if="isLoading" class="absolute-center" />
            <MessengerDialogLastMessage
                v-for="comment in comments"
                :key="comment.id"
                :last-message="comment.message"
                class="company-table-item__message w-100"
                column
            />
            <EmptyData v-if="comments.length === 0">Комментарии отсутствуют</EmptyData>
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

const comments = ref([]);
const pagination = ref(null);

const currentPage = ref(1);

function setNextPage(page) {
    currentPage.value = page;
}

async function fetchComments() {
    isLoading.value = true;

    try {
        const response = await api.entityMessageLink.search(createQuery());

        comments.value = response.data;
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
        kind: 'comment'
    };
}

watch(currentPage, useDebounceFn(fetchComments, 300));

onBeforeMount(async () => {
    isInitialLoading.value = true;
    await fetchComments();
    isInitialLoading.value = false;
});
</script>
