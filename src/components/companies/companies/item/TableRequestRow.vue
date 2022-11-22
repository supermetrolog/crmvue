<template>
  <tr class="TableRequestRow">
    <td></td>
    <td colspan="5">
      <CompanyTableMiniTimeline
        @click="clickTimeline"
        class="CompanyTableItem-block-timeline"
        v-for="timeline in timelines"
        :key="timeline.id"
        :currentSteps="timeline.timelineSteps"
        :requestName="requestName"
      />
    </td>
    <td class="text-warning CompanyTableItem-notif">
      {{ attention ? "Уделите внимание запросу!" : "" }}
    </td>
    <td class="date text-center">{{ formattedDate }}</td>
  </tr>
</template>

<script>
import moment from "moment";
import CompanyTableMiniTimeline from "./CompanyTableMiniTimeline.vue";
export default {
  name: "TableRequestRow",
  components: { CompanyTableMiniTimeline },
  props: {
    timelines: {
      type: Array,
      required: true,
    },
    requestName: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      default: new Date(),
    },
    attention: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    formattedDate() {
      return moment(this.date).format("DD.MM.YYYY");
    },
  },
  methods: {
    clickTimeline() {
      this.$emit("clickTimeline");
    },
  },
};
</script>