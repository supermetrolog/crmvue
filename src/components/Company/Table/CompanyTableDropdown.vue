<template>
    <CompanyTableDropdownRow
        :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }"
        :colspan="5"
    >
        <Dropdown
            v-model="requestsIsOpen"
            :title="'Запросы'"
            :mainNumber="activeRequests.length"
            :sideNumber="archiveRequests.length"
            class="text-success"
            v-if="activeRequests.length"
        />
        <Dropdown
            v-model="objectsIsOpen"
            :title="'Объекты'"
            :mainNumber="objects.length"
            class="text-warning"
            v-if="objects.length"
        />
    </CompanyTableDropdownRow>
    <template v-if="requestsIsOpen">
        <CompanyTableRequestRow
            :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }"
            v-for="activeRequest in activeRequests"
            :key="activeRequest.id"
            :timelines="activeRequest.timelines"
            :requestName="activeRequest.format_name"
            :date="activeRequest.updated_at || activeRequest.created_at"
            @clickTimeline="clickTimeline(activeRequest)"
        />
    </template>
    <template v-if="requestsIsOpen && archiveRequests.length">
        <CompanyTableDropdownRow
            :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }"
            :colspan="5"
        >
            <Dropdown
                v-model="archiveRequestsIsOpen"
                :title="'Архивные'"
                :mainNumber="archiveRequests.length"
                class="text-grey"
            />
        </CompanyTableDropdownRow>

        <template v-if="requestsIsOpen && archiveRequestsIsOpen"
        >
            <CompanyTableRequestRow
                class="content-archive"
                :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }"
                v-for="archiveRequest in archiveRequests"
                :key="archiveRequest.id"
                :timelines="archiveRequest.timelines"
                :requestName="archiveRequest.format_name"
                :date="archiveRequest.updated_at || archiveRequest.created_at"
                @clickTimeline="clickTimeline(archiveRequest)"
            />
        </template>
    </template>
    <template v-if="objects.length && objectsIsOpen">
        <CompanyTableDropdownRow
            :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }"
            :colspan="5"
            v-if="requestsIsOpen"
        >
            <Dropdown
                v-model="objectsIsOpen"
                :title="'Объекты'"
                class="text-warning"
                :mainNumber="objects.length"
            />
        </CompanyTableDropdownRow>
        <CompanyTableObjectRow
            class="CompanyTableItem-block"
            :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }"
            v-for="object in objects"
            :key="object.id"
            :object="object"
        />
    </template>
</template>

<script>
import Dropdown from "@/components/common/Dropdown/Dropdown.vue";
import CompanyTableDropdownRow from "@/components/Company/Table/CompanyTableDropdownRow.vue";
import CompanyTableRequestRow from "@/components/Company/Table/CompanyTableRequestRow.vue";
import CompanyTableObjectRow from "@/components/Company/Table/CompanyTableObjectRow.vue";


export default {
    name: "CompanyTableDropdown",
    components: {
        CompanyTableObjectRow,
        CompanyTableRequestRow,
        CompanyTableDropdownRow,
        Dropdown,
    },
    props: {
        odd: {
            type: Boolean,
            default: false,
        },
        activeRequests: {
            type: Array,
            default: () => [],
        },
        archiveRequests: {
            type: Array,
            default: () => [],
        },
        objects: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            requestsIsOpen: false,
            archiveRequestsIsOpen: false,
            objectsIsOpen: false,
        };
    },
    methods: {
        clickTimeline(request) {
            this.$emit("clickTimeline", request);
        },
    },
    emits: ["clickTimeline"],
};
</script>