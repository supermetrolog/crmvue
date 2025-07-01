<template>
    <section class="calls-page">
        <div class="container-fluid">
            <div class="row">
                <UiCol :cols="12">
                    <div v-if="surveys.length" v-show="!isLoading" class="white-block mb-2">
                        <PaginationClassic @next="setNextPage" :pagination="pagination" />
                    </div>
                    <Spinner v-if="isLoading && !surveys.length" />
                    <EmptyData v-else-if="!surveys.length">Ваш список черновиков пуст..</EmptyData>
                    <SurveyDraftTable
                        v-if="surveys.length"
                        @to-chat="toChat"
                        @open-survey="openSurvey"
                        @continue-draft="continueDraft"
                        @delete-draft="deleteDraft"
                        :loading="isLoading || draftIsDeleting"
                        :surveys
                    />
                    <div v-if="surveys.length" v-show="!isLoading" class="white-block mt-3">
                        <PaginationClassic @next="setNextPage" :pagination="pagination" />
                    </div>
                </UiCol>
            </div>
        </div>
    </section>
</template>

<script setup>
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import api from '@/api/api.js';
import Spinner from '@/components/common/Spinner.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import { onBeforeMount, ref, watch } from 'vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import { useRoute, useRouter } from 'vue-router';
import { useDebounceFn } from '@vueuse/core';
import { useMessenger } from '@/components/Messenger/useMessenger.js';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import SurveyDraftTable from '@/components/SurveyTable/SurveyDraftTable.vue';
import { useSurveyForm } from '@/composables/useSurveyForm.js';
import { useAsync } from '@/composables/useAsync.js';
import { useAuth } from '@/composables/useAuth.js';
import { spliceById } from '@/utils/helpers/array/spliceById.js';

const route = useRoute();
const router = useRouter();

const isLoading = ref(false);

const surveys = ref([]);
const pagination = ref(null);

async function fetchSurveys() {
    isLoading.value = true;

    const response = await api.survey.list(createQuery());
    if (response) {
        surveys.value = response.data;
        pagination.value = response.pagination;
    }

    isLoading.value = false;
}

onBeforeMount(fetchSurveys);

const debouncedFetchSurveys = useDebounceFn(fetchSurveys, 200);

watch(() => route.query?.sort, debouncedFetchSurveys);
watch(() => route.query?.page, debouncedFetchSurveys);

const { currentUserId } = useAuth();

function createQuery() {
    return {
        sort: '-updated_at',
        ...route.query,
        statuses: ['delayed', 'draft'],
        user_id: currentUserId.value
    };
}

function setNextPage(page) {
    router.replace({ query: { ...route.query, page } });
}

// chat

const { openChatById } = useMessenger();

function toChat(survey) {
    openChatById(survey.chat_member_id);
}

const { show: showSurvey } = useAsyncPopup('surveyPreview');

const { openSurvey: openAdvancedSurvey } = useSurveyForm();

function openSurvey(survey) {
    showSurvey({ surveyId: survey.id });
}

function continueDraft(survey) {
    openAdvancedSurvey(survey.chatMember.model_id);
}

// delete

const { isLoading: draftIsDeleting, execute: deleteDraft } = useAsync(api.survey.delete, {
    onFetchResponse({ args }) {
        spliceById(surveys.value, args[0]);
    },
    confirmation: true,
    confirmationContent: {
        title: 'Удалить черновик',
        message:
            'Вы уверены, что хотите безвозвратно удалить черновик? Весь прогресс заполнения будет утерян',
        okButton: 'Удалить',
        okIcon: 'fa-solid fa-trash'
    }
});
</script>
