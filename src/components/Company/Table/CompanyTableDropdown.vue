<template>
    <CompanyTableDropdownRow
        class="company-table-dropdown"
        :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }"
    >
        <div class="d-flex gap-1 align-items-center">
            <Tippy>
                <CompanyTableDropdownButton
                    v-if="activeRequests.length"
                    v-model="requestsIsOpen"
                    :color="requestsIsOpen ? 'success' : 'success-light'"
                    :count="activeRequests.length"
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
                :color="objectsIsOpen ? 'dark' : 'light'"
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
            >
                Созданы задачи ({{ createdTasksCount }})
            </UiButton>
        </div>
    </CompanyTableDropdownRow>
    <template v-if="requestsIsOpen">
        <CompanyTableRequestRow
            v-for="activeRequest in activeRequests"
            :key="activeRequest.id"
            @open-timeline="openTimeline(activeRequest.id)"
            :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }"
            :timelines="activeRequest.timelines"
            :request-name="activeRequest.format_name"
            :date="activeRequest.updated_at || activeRequest.created_at"
        />
    </template>
    <template v-if="requestsIsOpen && archiveRequests.length">
        <CompanyTableDropdownRow
            :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }"
            :colspan="5"
        >
            <Dropdown
                v-model="archiveRequestsIsOpen"
                title="Архивные запросы"
                :main-number="archiveRequests.length"
                class="dashboard-bg-gray-l"
            />
        </CompanyTableDropdownRow>
        <template v-if="requestsIsOpen && archiveRequestsIsOpen">
            <CompanyTableRequestRow
                v-for="archiveRequest in archiveRequests"
                :key="archiveRequest.id"
                @open-timeline="$emit('open-timeline', archiveRequest.id)"
                class="content-archive"
                :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }"
                :timelines="archiveRequest.timelines"
                :request-name="archiveRequest.format_name"
                :date="archiveRequest.updated_at || archiveRequest.created_at"
            />
        </template>
    </template>
    <template v-if="objects.length && objectsIsOpen">
        <CompanyTableObjectRow
            v-for="object in objects"
            :key="object.id"
            :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }"
            :object="object"
        />
    </template>
</template>

<script setup>
import Dropdown from '@/components/common/Dropdown/Dropdown.vue';
import CompanyTableDropdownRow from '@/components/Company/Table/CompanyTableDropdownRow.vue';
import CompanyTableRequestRow from '@/components/Company/Table/CompanyTableRequestRow.vue';
import CompanyTableObjectRow from '@/components/Company/Table/CompanyTableObjectRow.vue';
import { computed, ref } from 'vue';
import { Tippy } from 'vue-tippy';
import { plural } from '@/utils/plural.js';
import CompanyTableDropdownButton from '@/components/Company/Table/CompanyTableDropdownButton.vue';
import UiButton from '@/components/common/UI/UiButton.vue';

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
    }
});

const requestsIsOpen = ref(false);
const archiveRequestsIsOpen = ref(false);
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
</script>
