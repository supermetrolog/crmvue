<template>
    <CompanyTableDropdownRow :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }" :colspan="5">
        <Dropdown
            v-if="activeRequests.length"
            v-model="requestsIsOpen"
            :title="'Запросы'"
            :main-number="activeRequests.length"
            :side-number="archiveRequests.length"
            class="text-success"
        />
        <Dropdown
            v-if="objects.length"
            v-model="objectsIsOpen"
            :title="'Объекты'"
            :main-number="objects.length"
            class="text-warning"
        />
    </CompanyTableDropdownRow>
    <template v-if="requestsIsOpen">
        <CompanyTableRequestRow
            v-for="activeRequest in activeRequests"
            :key="activeRequest.id"
            @clickTimeline="clickTimeline(activeRequest)"
            :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }"
            :timelines="activeRequest.timelines"
            :request-name="activeRequest.format_name"
            :date="activeRequest.updated_at || activeRequest.created_at"
        />
    </template>
    <template v-if="requestsIsOpen && archiveRequests.length">
        <CompanyTableDropdownRow :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }" :colspan="5">
            <Dropdown
                v-model="archiveRequestsIsOpen"
                :title="'Архивные'"
                :main-number="archiveRequests.length"
                class="text-grey"
            />
        </CompanyTableDropdownRow>

        <template v-if="requestsIsOpen && archiveRequestsIsOpen">
            <CompanyTableRequestRow
                v-for="archiveRequest in archiveRequests"
                :key="archiveRequest.id"
                @clickTimeline="clickTimeline(archiveRequest)"
                class="content-archive"
                :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }"
                :timelines="archiveRequest.timelines"
                :request-name="archiveRequest.format_name"
                :date="archiveRequest.updated_at || archiveRequest.created_at"
            />
        </template>
    </template>
    <template v-if="objects.length && objectsIsOpen">
        <CompanyTableDropdownRow
            v-if="requestsIsOpen"
            :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }"
            :colspan="5"
        >
            <Dropdown v-model="objectsIsOpen" :title="'Объекты'" class="text-warning" :main-number="objects.length" />
        </CompanyTableDropdownRow>
        <CompanyTableObjectRow
            v-for="object in objects"
            :key="object.id"
            class="CompanyTableItem-block"
            :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }"
            :object="object"
        />
    </template>
</template>

<script>
import Dropdown from '@/components/common/Dropdown/Dropdown.vue';
import CompanyTableDropdownRow from '@/components/Company/Table/CompanyTableDropdownRow.vue';
import CompanyTableRequestRow from '@/components/Company/Table/CompanyTableRequestRow.vue';
import CompanyTableObjectRow from '@/components/Company/Table/CompanyTableObjectRow.vue';

export default {
    name: 'CompanyTableDropdown',
    components: {
        CompanyTableObjectRow,
        CompanyTableRequestRow,
        CompanyTableDropdownRow,
        Dropdown
    },
    emits: ['clickTimeline'],
    props: {
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
    },
    data() {
        return {
            requestsIsOpen: false,
            archiveRequestsIsOpen: false,
            objectsIsOpen: false
        };
    },
    methods: {
        clickTimeline(request) {
            this.$emit('clickTimeline', request);
        }
    }
};
</script>