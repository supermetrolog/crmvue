<template>
  <div class="CompanyLogsList" :class="[target]">
    <InfiniteLoading class="loader" top v-bind="$attrs" :target="`.${target}`">
      <template #complete><span></span></template>
    </InfiniteLoading>
    <CompanyLogsItem
      v-for="(comment, idx) in formattedLogs"
      :key="comment.id"
      class="result"
      :logItem="comment"
      :preventLogItem="getPreventLogItem(idx)"
    />
    <div class="CompanyLogsList-scroll"></div>
  </div>
</template>

<script>
import CompanyLogsItem from "../logsItem/CompanyLogsItem.vue";
import InfiniteLoading from "v3-infinite-loading";
import { logHandler } from "../utils";
import "./styles.scss";
import "v3-infinite-loading/lib/style.css";

export default {
  name: "CompanyLogsList",
  components: { CompanyLogsItem, InfiniteLoading },
  props: {
    logs: {
      type: Array,
      default: () => [],
    },
    target: {
      type: String,
      default: "infinite-loading",
    },
  },
  computed: {
    formattedLogs() {
      return logHandler.logListFormat(this.logs);
    },
    lastMessage() {
      let [result] = this.formattedLogs.slice(-1);
      return result;
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
    lastMessageScroll(b) {
      let e = document.querySelector(".CompanyLogsList-scroll");
      if (!e) return;

      e.scrollIntoView({
        behavior: b || "auto",
        block: "end",
      });
    },
  },
  watch: {
    lastMessage: {
      handler: function (newItem, oldItem) {
        if (newItem?.id !== oldItem?.id) {
          this.lastMessageScroll();
        }
      },
      deep: true,
    },
  },
};
</script>