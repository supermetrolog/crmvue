<template>
    <div>
        <div class="white-block mb-3">
            <div class="d-flex justify-content-between">
                <PaginationClassic
                    @next="setNextPage"
                    :pagination="pagination"
                    :loading="isLoading"
                />
                <UiButton @click="formIsVisible = true" color="light" icon="fa-solid fa-plus">
                    Добавить шаблон
                </UiButton>
            </div>
        </div>
        <Spinner v-if="isLoading && !templates.length" />
        <AdminNotificationsTemplatesTable
            v-else
            @edit="editTemplate"
            @disable="disableTemplate"
            @enable="enableTemplate"
            :loading="isLoading"
            :templates
        />
        <AdminNotificationsTemplatesForm
            v-if="formIsVisible"
            @created="onCreateTemplate"
            @updated="onUpdateTemplate"
            @close="closeForm"
            :template-id="editingTemplateId"
        />
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Spinner from '@/components/common/Spinner.vue';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import { useDebounceFn } from '@vueuse/core';
import api from '@/api/api.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import { UserNotificationTemplate } from '@/types/user-notification/user-notification-template';
import AdminNotificationsTemplatesTable from '@/components/Admin/Notifications/AdminNotificationsTemplatesTable.vue';
import { useAsync } from '@/composables/useAsync';
import AdminNotificationsTemplatesForm from '@/components/Admin/Notifications/AdminNotificationsTemplatesForm.vue';
import { useNotify } from '@/utils/use/useNotify';

const route = useRoute();
const router = useRouter();

const isLoading = ref(false);

const templates = ref<UserNotificationTemplate[]>([]);
const pagination = ref(null);

async function fetchNotificationTemplates() {
    isLoading.value = true;

    const response = await api.userNotificationTemplates.list({ page: route.query.page ?? 1 });

    if (response) {
        templates.value = response.data;
        pagination.value = response.pagination;
    }

    isLoading.value = false;
}

onBeforeMount(fetchNotificationTemplates);

const debouncedFetchNotificationTemplates = useDebounceFn(fetchNotificationTemplates, 200);

watch(() => route.query?.page, debouncedFetchNotificationTemplates);

function setNextPage(page: number) {
    router.replace({ query: { ...route.query, page } });
}

// actions

const editingTemplateId = ref<number | null>(null);
const formIsVisible = ref(false);

function editTemplate(templateId: number) {
    editingTemplateId.value = templateId;
    formIsVisible.value = true;
}

function updateLocalTemplate(templateId: number, payload: UserNotificationTemplate) {
    const templateIndex = templates.value.findIndex(t => t.id === templateId);

    if (templateIndex !== -1) {
        Object.assign(templates.value[templateIndex], payload);
    }
}

function onUpdateTemplate(template: UserNotificationTemplate) {
    formIsVisible.value = false;
    editingTemplateId.value = null;

    updateLocalTemplate(template.id, template);
}

function onCreateTemplate(template: UserNotificationTemplate) {
    formIsVisible.value = false;

    templates.value.unshift(template);
}

function closeForm() {
    formIsVisible.value = false;
    editingTemplateId.value = null;
}

const notify = useNotify();

const { execute: enableTemplate } = useAsync(api.userNotificationTemplates.enable, {
    onFetchResponse({ response }) {
        notify.success('Шаблон активирован');

        updateLocalTemplate(response.id, response);
    }
});
const { execute: disableTemplate } = useAsync(api.userNotificationTemplates.disable, {
    onFetchResponse({ response }) {
        notify.success('Шаблон отключен');

        updateLocalTemplate(response.id, response);
    }
});
</script>
