<template>
    <AnimationTransition :speed="0.7">
        <div v-if="modalsCount || draftsCount > 0" class="minimized-modals">
            <template v-if="modalsCount">
                <div class="minimized-modals__header">
                    <p>Открытые опросы ({{ modalsCount }})</p>
                    <UiButtonIcon
                        v-if="manager.modals.length > 2"
                        @click="isOpened = !isOpened"
                        :icon="isOpened ? 'fa-solid fa-angle-down' : 'fa-solid fa-angle-up'"
                        :label="isOpened ? 'Свернуть' : 'Просмотреть больше'"
                        small
                    />
                </div>
                <div class="minimized-modals__list" :class="{ opened: isOpened }">
                    <UiMinimizeModalPreview
                        v-for="modal in manager.modals"
                        :key="modal.id"
                        @expand="expandModal(modal)"
                        @close="closeModal(modal)"
                        :title="modal.title"
                    />
                </div>
            </template>
            <hr v-if="modalsCount && draftsCount" />
            <div v-if="draftsCount" class="px-1 d-flex align-items-center justify-content-between">
                <p>{{ modalsCount ? 'Всего' : 'У вас' }} {{ draftsCountLabel }}</p>
                <RouterLink :to="{ name: 'survey-drafts' }">
                    <UiButton
                        small
                        color="success-light"
                        icon="fa-solid fa-up-right-from-square"
                        :disabled="draftsIsLoading"
                        tooltip="Перейти к списку черновиков"
                    >
                        Перейти
                    </UiButton>
                </RouterLink>
            </div>
        </div>
    </AnimationTransition>
</template>
<script setup>
import UiMinimizeModalPreview from '@/components/common/UI/UiMinimizeModalPreview.vue';
import { getMinimizedModalManager } from '@/composables/useMinimizedModalManager.js';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import { computed, onMounted, ref, watch } from 'vue';
import api from '@/api/api.js';
import { useAuth } from '@/composables/useAuth.js';
import { useDebounceFn, useDocumentVisibility, useIntervalFn, useLocalStorage } from '@vueuse/core';
import { LOCALSTORAGE_PREFIX } from '@/services/localStorage.js';
import { isNullish } from '@/utils/helpers/common/isNullish.ts';
import dayjs from 'dayjs';
import { plural } from '@/utils/plural.js';
import UiButton from '@/components/common/UI/UiButton.vue';

const manager = getMinimizedModalManager();

function expandModal(modal) {
    manager.expandModal(modal);
}

function closeModal(modal) {
    manager.closeModal(modal);
}

const modalsCount = computed(() => manager.modals.length);

const isOpened = ref(false);

// drafts

const draftsCount = ref(0);
const draftsCountLabel = computed(() =>
    plural(
        draftsCount.value,
        `%d незавершенный опрос`,
        '%d незавершенных опроса',
        '%d незавершенных опросов'
    )
);

const draftsIsLoading = ref(false);

const { currentUserId } = useAuth();

const draftsStorage = useLocalStorage(`${LOCALSTORAGE_PREFIX}drafts`, {
    count: 0,
    last_update: null
});

async function fetchDrafts() {
    draftsIsLoading.value = true;

    const response = await api.survey.list({
        status: 'draft',
        user_id: currentUserId.value,
        'per-page': 1
    });

    draftsCount.value = response.pagination.totalCount;

    draftsStorage.value.last_update = dayjs().toJSON();
    draftsStorage.value.count = response.pagination.totalCount;

    draftsIsLoading.value = false;
}

const debouncedFetchDrafts = useDebounceFn(fetchDrafts, 2000);

watch(modalsCount, debouncedFetchDrafts);

const { pause, resume } = useIntervalFn(fetchDrafts, 300000);

const documentVisibility = useDocumentVisibility();

watch(documentVisibility, value => {
    if (value) resume();
    else pause();
});

onMounted(() => {
    if (
        isNullish(draftsStorage.value.last_update) ||
        Math.abs(dayjs(draftsStorage.value.last_update).diff(dayjs(), 'minute')) > 10
    ) {
        fetchDrafts();
    } else {
        draftsCount.value = draftsStorage.value.count ?? 0;
    }
});
</script>
