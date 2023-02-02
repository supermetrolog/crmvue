<template>
  <div class="CompanyLogsList">
    <CompanyLogsItem
      v-for="(logItem, idx) in formattedLogs"
      :key="logItem.id"
      :logItem="logItem"
      :preventLogItem="getPreventLogItem(idx)"
    >
    </CompanyLogsItem>
  </div>
</template>

<script>
import CompanyLogsItem from "../logsItem/CompanyLogsItem.vue";
import "./styles.scss";
import { logHandler } from "../utils";

export default {
  name: "CompanyLogsList",
  components: { CompanyLogsItem },
  props: {
    logs: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    formattedLogs() {
      return logHandler.logListFormat(this.logs);
    },
  },
  methods: {
    getPreventLogItem(index) {
      if (!index) {
        return null;
      }
      if (Array.isArray(this.formattedLogs) && this.formattedLogs[index - 1]) {
        return this.formattedLogs[index - 1];
      }
    },
  },
};
</script>