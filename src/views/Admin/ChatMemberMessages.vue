<template>
    <section class="calls-page">
        <div class="container-fluid">
            <div class="row">
                <UiCol :cols="12">
                    <div class="white-block">
                        <div class="row">
                            <UiCol :cols="12">
                                <AdminChatMemberMessageSearch />
                            </UiCol>
                        </div>
                    </div>
                </UiCol>
                <UiCol :cols="12">
                    <div class="white-block mb-3">
                        <div class="row">
                            <PaginationClassic
                                ref="firstPagination"
                                @next="setNextPage"
                                :pagination="pagination"
                                class="col-xxl-6 col-lg-8 col-2"
                                :loading="isLoading"
                            />
                        </div>
                    </div>
                    <Spinner v-if="isLoading && !messages.length" />
                    <EmptyData v-else-if="!messages.length">Список сообщений пуст..</EmptyData>
                    <AdminChatMemberMessageTable
                        v-if="messages.length"
                        @pin-to-entity="pinToEntity"
                        @delete="deleteMessage"
                        :messages
                        :loading="isLoading || isDeleting"
                    />
                    <div v-if="messages.length" v-show="!isLoading" class="white-block mt-3">
                        <PaginationClassic @next="setNextPage" :pagination="pagination" />
                    </div>
                </UiCol>
            </div>
        </div>
        <teleport to="body">
            <AdminChatMemberMessageRelationsForm
                v-if="companyRelationsModalIsVisible"
                @close="closeCompanyRelationsModal"
                @created="closeCompanyRelationsModal"
                :message="companyRelationsMessage"
            />
        </teleport>
    </section>
</template>

<script setup>
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import api from '@/api/api.js';
import Spinner from '@/components/common/Spinner.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import { onBeforeMount, ref, shallowRef, watch } from 'vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import { useRoute, useRouter } from 'vue-router';
import { useDebounceFn } from '@vueuse/core';
import { useNotify } from '@/utils/use/useNotify.js';
import { useAsync } from '@/composables/useAsync';
import AdminChatMemberMessageRelationsForm from '@/components/Admin/ChatMemberMessage/AdminChatMemberMessageRelationsForm.vue';
import AdminChatMemberMessageTable from '@/components/Admin/ChatMemberMessage/Table/AdminChatMemberMessageTable.vue';
import AdminChatMemberMessageSearch from '@/components/Admin/ChatMemberMessage/AdminChatMemberMessageSearch.vue';

const route = useRoute();
const router = useRouter();

const isLoading = ref(false);

const messages = ref([]);
const pagination = ref(null);

async function fetchMessages() {
    isLoading.value = true;

    const response = await api.messenger.searchMessages(createQuery());

    if (response) {
        messages.value = response.data;
        pagination.value = response.pagination;
    }

    isLoading.value = false;
}

onBeforeMount(fetchMessages);

const debouncedFetchMessages = useDebounceFn(fetchMessages, 200);

watch(() => route.query, debouncedFetchMessages, { deep: true });

function createQuery() {
    return {
        ...route.query
    };
}

function setNextPage(page) {
    router.replace({ query: { ...route.query, page } });
}

// actions

const notify = useNotify();

const companyRelationsModalIsVisible = ref(false);
const companyRelationsMessage = shallowRef(null);

function pinToEntity(message) {
    companyRelationsMessage.value = message;
    companyRelationsModalIsVisible.value = true;
}

function closeCompanyRelationsModal() {
    companyRelationsModalIsVisible.value = false;
    companyRelationsMessage.value = null;
}

const { isLoading: isDeleting, execute: deleteMessage } = useAsync(api.messenger.deleteMessage, {
    onFetchResponse: ({ args }) => {
        notify.success('Сообщение успешно удалено.');

        const messageIndex = messages.value.findIndex(m => m.id === args[0]);

        if (messageIndex !== -1) {
            messages.value.splice(messageIndex, 1);
        }
    },
    confirmation: true,
    confirmationContent: {
        title: 'Удалить сообщение',
        message:
            'Вы уверены, что хотите удалить сообщение? Удаленное сообщение нельзя восстановить.',
        okButton: 'Удалить',
        okIcon: 'fa-solid fa-trash'
    }
});
</script>
