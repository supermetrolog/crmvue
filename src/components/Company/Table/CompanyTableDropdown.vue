<template>
    <CompanyTableDropdownRow
        class="company-table-dropdown"
        :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }"
    >
        <Dropdown
            v-if="activeRequests.length"
            v-model="requestsIsOpen"
            title="Запросы"
            :main-number="activeRequests.length"
            :side-number="archiveRequests.length"
            class="dashboard-bg-success-l"
        />
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
                @open-timeline="openTimeline(archiveRequest.id)"
                class="content-archive"
                :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }"
                :timelines="archiveRequest.timelines"
                :request-name="archiveRequest.format_name"
                :date="archiveRequest.updated_at || archiveRequest.created_at"
            />
        </template>
    </template>
    <CompanyTableDropdownRow
        class="company-table-dropdown"
        :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }"
    >
        <Dropdown
            v-if="objects.length"
            v-model="objectsIsOpen"
            title="Объекты"
            :main-number="objects.length"
            class="dashboard-bg-warning-l mb-1"
        />
    </CompanyTableDropdownRow>
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
import { ref } from 'vue';

const emit = defineEmits(['open-timeline']);
defineProps({
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
    objects: {
        type: Array,
        default: () => []
    }
});

const requestsIsOpen = ref(false);
const archiveRequestsIsOpen = ref(false);
const objectsIsOpen = ref(false);

const openTimeline = requestID => emit('open-timeline', requestID);
</script>
