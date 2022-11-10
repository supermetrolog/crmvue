<template>
  <DropdownSwitcherRow
    :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }"
    :colspan="7"
  >
    <DropdownSwitcher
      v-model="requestsIsOpen"
      :title="'Запросы'"
      :mainNumber="activeRequests.length"
      :sideNumber="archiveRequests.length"
      class="text-success"
      v-if="activeRequests.length"
    />
    <DropdownSwitcher
      v-model="objectsIsOpen"
      :title="'Объекты'"
      :mainNumber="objects.length"
      class="text-warning"
      v-if="objects.length"
    />
  </DropdownSwitcherRow>
  <template v-if="requestsIsOpen">
    <TableRequestRow
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
    <DropdownSwitcherRow
      :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }"
      :colspan="7"
    >
      <DropdownSwitcher
        v-model="archiveRequestsIsOpen"
        :title="'Архивные'"
        :mainNumber="archiveRequests.length"
        class="text-grey"
    /></DropdownSwitcherRow>

    <template v-if="requestsIsOpen && archiveRequestsIsOpen"
      ><TableRequestRow
        class="content-archive"
        :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }"
        v-for="archiveRequest in archiveRequests"
        :key="archiveRequest.id"
        :timelines="archiveRequest.timelines"
        :requestName="archiveRequest.format_name"
        :date="archiveRequest.updated_at || archiveRequest.created_at"
        @clickTimeline="clickTimeline(archiveRequest)"
    /></template>
  </template>
  <template v-if="objects.length && objectsIsOpen">
    <DropdownSwitcherRow
      :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }"
      :colspan="7"
      v-if="requestsIsOpen"
    >
      <DropdownSwitcher
        v-model="objectsIsOpen"
        :title="'Объекты'"
        class="text-warning"
        :mainNumber="objects.length"
      />
    </DropdownSwitcherRow>
    <TableObjectRow
      class="CompanyTableItem-block"
      :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }"
      v-for="object in objects"
      :key="object.id"
      :object="object"
    />
  </template>
</template>

<script>
import TableObjectRow from "./TableObjectRow.vue";
import TableRequestRow from "./TableRequestRow.vue";
import DropdownSwitcher from "../../../common/dropdown/DropdownSwitcher.vue";
import DropdownSwitcherRow from "./DropdownSwitcherRow.vue";
export default {
  name: "CompanyTableDropdown",
  components: {
    DropdownSwitcherRow,
    DropdownSwitcher,
    TableRequestRow,
    TableObjectRow,
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