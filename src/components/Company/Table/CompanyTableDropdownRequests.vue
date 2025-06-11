<template>
    <tr class="table-request-row">
        <td colspan="6">
            <div class="px-3 py-4">
                <Spinner v-if="isLoading" small label="Загрузка запросов.." />
                <template v-else>
                    <div class="d-flex gap-2 mb-2">
                        <span class="font-weight-semi">Запросы</span>
                        <span>|</span>
                        <SurveyFormObjectsPreviewTab v-model="currentTab" :name="TABS.ACTIVE">
                            <i class="fa-solid fa-up-long mr-1" />
                            <span>Актив {{ requestsByGroups.active?.length }}</span>
                        </SurveyFormObjectsPreviewTab>
                        <SurveyFormObjectsPreviewTab
                            v-if="requestsByGroups.passive?.length"
                            v-model="currentTab"
                            :name="TABS.PASSIVE"
                        >
                            <i class="fa-solid fa-down-long mr-1 text-danger" />
                            <span>Пассив {{ requestsByGroups.passive?.length }}</span>
                        </SurveyFormObjectsPreviewTab>
                        <SurveyFormObjectsPreviewTab
                            v-if="requestsByGroups.done?.length"
                            v-model="currentTab"
                            :name="TABS.DONE"
                        >
                            <i class="fa-solid fa-down-long mr-1 text-danger" />
                            <span>Завершенные {{ requestsByGroups.passive?.length }}</span>
                        </SurveyFormObjectsPreviewTab>
                    </div>
                    <AnimationTransition :speed="0.3">
                        <div v-if="currentTab === TABS.ACTIVE" class="d-flex flex-column gap-2">
                            <CompanyTableDropdownRequest
                                v-for="request in requestsByGroups.active"
                                :key="request.id"
                                @open-timeline="$emit('open-timeline', request.id)"
                                @create-task="$emit('create-task', request)"
                                :request="request"
                            />
                            <UiField
                                v-if="requestsByGroups.active === undefined"
                                class="mx-auto my-2"
                                color="light"
                            >
                                Список активных запросов пуст..
                            </UiField>
                        </div>
                        <div
                            v-else-if="currentTab === TABS.PASSIVE"
                            class="d-flex flex-column gap-2"
                        >
                            <CompanyTableDropdownRequest
                                v-for="request in requestsByGroups.passive"
                                :key="request.id"
                                @open-timeline="$emit('open-timeline', request.id)"
                                @create-task="$emit('create-task', request)"
                                :request="request"
                                class="content-archive"
                            />
                        </div>
                        <div v-else-if="currentTab === TABS.DONE" class="d-flex flex-column gap-2">
                            <CompanyTableDropdownRequest
                                v-for="request in requestsByGroups.done"
                                :key="request.id"
                                @open-timeline="$emit('open-timeline', request.id)"
                                @create-task="$emit('create-task', request)"
                                :request="request"
                                class="content-archive"
                            />
                        </div>
                    </AnimationTransition>
                </template>
            </div>
        </td>
    </tr>
</template>

<script setup>
import SurveyFormObjectsPreviewTab from '@/components/SurveyForm/ObjectsPreview/SurveyFormObjectsPreviewTab.vue';
import { computed, onBeforeMount, ref, shallowRef } from 'vue';
import api from '@/api/api.js';
import Spinner from '@/components/common/Spinner.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import UiField from '@/components/common/UI/UiField.vue';
import CompanyTableDropdownRequest from '@/components/Company/Table/CompanyTableDropdownRequest.vue';

defineEmits(['open-timeline', 'create-task']);
const props = defineProps({
    companyId: Number
});

const requests = shallowRef([]);

const requestsGroups = {
    0: 'passive',
    1: 'active',
    2: 'done',
    5: 'passive'
};

const requestsByGroups = computed(() =>
    Object.groupBy(requests.value, ({ status }) => requestsGroups[status])
);

const isLoading = ref(false);

async function fetchRequests() {
    isLoading.value = true;

    requests.value = await api.request.byCompanyId(props.companyId);

    isLoading.value = false;
}

onBeforeMount(fetchRequests);

// tabs

const TABS = {
    ACTIVE: 'active',
    PASSIVE: 'passive'
};

const currentTab = ref(TABS.ACTIVE);
</script>
