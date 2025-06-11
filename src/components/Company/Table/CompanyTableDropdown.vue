<template>
    <CompanyTableDropdownRow
        class="company-table-dropdown"
        :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }"
    >
        <div class="d-flex gap-1 align-items-center">
            <Tippy>
                <CompanyTableDropdownButton
                    v-if="activeRequests.length || archiveRequests.length || doneRequests.length"
                    v-model="requestsIsOpen"
                    :color="requestsIsOpen ? 'success-light' : 'transparent'"
                    :count="activeRequests.length"
                    :second-count="archiveRequests.length + doneRequests.length"
                    label="Запросы"
                />
                <template #content>
                    <div>
                        <p>{{ activeRequestsPluralLabel }}</p>
                        <p>{{ archiveRequestsPluralLabel }}</p>
                        <p>{{ doneRequestsPluralLabel }}</p>
                    </div>
                </template>
            </Tippy>
            <CompanyTableDropdownButton
                v-if="objects.length"
                v-model="objectsIsOpen"
                :color="objectsIsOpen ? 'success-light' : 'transparent'"
                :count="objects.length"
                label="Объекты"
            />
            <UiButton
                v-if="tasksCount"
                @click="$emit('show-tasks')"
                color="danger-light"
                icon="fa-solid fa-arrow-up-right-from-square"
                class="fs-2"
                small
                bolder
                rect
            >
                Задачи ({{ tasksCount }})
            </UiButton>
            <UiButton
                v-if="createdTasksCount"
                @click="$emit('show-created-tasks')"
                color="success-light"
                icon="fa-solid fa-plus"
                class="fs-2"
                small
                bolder
                rect
            >
                Созданы задачи ({{ createdTasksCount }})
            </UiButton>
        </div>
    </CompanyTableDropdownRow>
    <CompanyTableDropdownRequests
        v-if="requestsIsOpen"
        @open-timeline="$emit('open-timeline', $event)"
        @create-task="createRequestTask"
        :company-id="company.id"
    />
    <tr v-if="objects.length && objectsIsOpen" class="table-object-row">
        <td colspan="6">
            <Spinner v-if="objectsIsLoading" class="my-4" />
            <div v-else class="px-3 py-4">
                <p class="font-weight-semi mb-2">Объекты</p>
                <ObjectTable :sortable="false" :objects="currentObjects" />
            </div>
        </td>
    </tr>
</template>

<script setup>
import CompanyTableDropdownRow from '@/components/Company/Table/CompanyTableDropdownRow.vue';
import { computed, ref, shallowRef, watch } from 'vue';
import { Tippy } from 'vue-tippy';
import { plural } from '@/utils/plural.js';
import CompanyTableDropdownButton from '@/components/Company/Table/CompanyTableDropdownButton.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import api from '@/api/api.js';
import Spinner from '@/components/common/Spinner.vue';
import ObjectTable from '@/components/ObjectTable/ObjectTable.vue';
import CompanyTableDropdownRequests from '@/components/Company/Table/CompanyTableDropdownRequests.vue';
import { getCompanyShortName } from '@/utils/formatters/models/company.js';
import { useTaskManager } from '@/composables/useTaskManager.js';
import { useNotify } from '@/utils/use/useNotify.js';

defineEmits(['open-timeline', 'show-tasks', 'show-created-tasks']);
const props = defineProps({
    odd: {
        type: Boolean,
        default: false
    },
    activeRequests: {
        type: Array,
        default: () => []
    },
    archiveRequests: {
        type: Array,
        default: () => []
    },
    doneRequests: {
        type: Array,
        default: () => []
    },
    objects: {
        type: Array,
        default: () => []
    },
    tasksCount: Number,
    createdTasksCount: {
        type: Number,
        default: 0
    },
    company: {
        type: Object,
        required: true
    }
});

const requestsIsOpen = ref(false);
const objectsIsOpen = ref(false);

// plurals

const activeRequestsPluralLabel = computed(() =>
    plural(props.activeRequests.length, '%d активный', '%d активных', '%d активных')
);

const archiveRequestsPluralLabel = computed(() =>
    plural(props.archiveRequests.length, '%d архивный', '%d архивных', '%d архивных')
);

const doneRequestsPluralLabel = computed(() =>
    plural(props.doneRequests.length, '%d завершен', '%d завершенных', '%d завершенных')
);

const currentObjects = shallowRef([]);
const objectsIsLoading = ref(false);

async function fetchObjects() {
    objectsIsLoading.value = true;

    try {
        const response = await api.object.search({
            company_id: props.company.id,
            expand: 'offers,company.mainContact.phones,company.mainContact.emails,company.objects_count,company.active_requests_count,company.active_contacts_count'
        });

        currentObjects.value = response.data;
    } finally {
        objectsIsLoading.value = false;
    }
}

watch(objectsIsOpen, value => {
    if (value && !objectsIsLoading.value && !currentObjects.value.length) {
        fetchObjects();
    }
});

// tasks

const { createTaskWithTemplate } = useTaskManager();
const notify = useNotify();

const taskIsCreating = ref(false);

async function createRequestTask(request) {
    const companyName = getCompanyShortName(props.company);

    const taskPayload = await createTaskWithTemplate({
        title: `Запрос #${request.id} (комп. ${companyName}) `,
        relations: [
            { entity_type: 'company', entity_id: props.company.id },
            { entity_type: 'request', entity_id: request.id }
        ]
    });

    if (!taskPayload) return;

    taskIsCreating.value = true;

    try {
        await api.task.create(taskPayload);
        notify.success('Задача успешно создана!');
    } finally {
        taskIsCreating.value = false;
    }
}
</script>
