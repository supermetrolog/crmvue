<template>
    <section class="calls-page">
        <div class="container-fluid">
            <div class="row">
                <UiCol :cols="12">
                    <div class="white-block mb-3">
                        <div class="row">
                            <UiCol :cols="12">
                                <FormSurveySearch @search="debouncedFetchSurveys" />
                            </UiCol>
                            <PaginationClassic
                                ref="firstPagination"
                                @next="setNextPage"
                                :pagination="pagination"
                                class="col-xxl-6 col-lg-8 col-2"
                                :loading="isLoading"
                            />
                        </div>
                    </div>
                    <Spinner v-if="isLoading && !surveys.length" />
                    <EmptyData v-else-if="!surveys.length">Список опросов пуст..</EmptyData>
                    <SurveyTable
                        v-if="surveys.length"
                        @to-chat="toChat"
                        @open-survey="openSurvey"
                        :loading="isLoading"
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
import SurveyTable from '@/components/SurveyTable/SurveyTable.vue';
import FormSurveySearch from '@/components/Forms/Survey/FormSurveySearch.vue';
import { useMessenger } from '@/components/Messenger/useMessenger.js';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';

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

function createQuery() {
    return {
        sort: '-created_at',
        ...route.query
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

function openSurvey(survey) {
    showSurvey({ surveyId: survey.id });
}
</script>
