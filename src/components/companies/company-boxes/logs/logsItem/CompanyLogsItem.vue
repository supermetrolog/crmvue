<template>
  <div class="CompanyLogsItem">
    <div
      class="date"
      :class="{
        main: date.type,
        noMain: !date.type,
      }"
    >
      <p v-if="date.type">{{ date.value }}</p>
    </div>
    <div class="user">
      <i
        class="text-dark"
        :class="{
          'text-success_alt': isSystemComment,
        }"
      >
        {{ logItem.user || "&#8212;" }}
      </i>
    </div>

    <div class="message">
      <p v-html="timeHTML + logItem.message" class="d-inline"></p>
      <!-- <a
        v-if="logItem.letter_id"
        @click="openLetterView"
        class="d-inline text-primary ml-2"
        :href="'/letters/' + data.letter_id"
        >посмотреть</a
      > -->
    </div>
  </div>
</template>

<script>
import moment from "moment";
// import "./styles.scss";

export default {
  name: "CompanyLogsItem",
  props: {
    logItem: {
      type: Object,
      required: true,
    },
    preventLogItem: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {
    isSystemComment() {
      if (!this.logItem.user) {
        return true;
      }
      //   if (this.logItem.user.includes("система")) {
      //     return true;
      //   }
      return false;
    },
    date() {
      const result = {
        value: null,
        type: 1,
      };
      const dateFormat = "YYYY-MM-DD";
      const timeFormat = "HH:mm";
      let date = moment(this.logItem.created_at).format(dateFormat);

      if (this.preventLogItem) {
        let preventDate = moment(this.preventLogItem.created_at).format(
          dateFormat
        );
        if (date == preventDate) {
          result.value = moment(this.logItem.created_at).format(timeFormat);
          result.type = 0;
          return result;
        }
      }

      let currentDate = moment(new Date()).format(dateFormat);
      if (date == currentDate) {
        result.value = "сегодня";
        return result;
      }
      let preventDayDate = moment().subtract(1, "days").format(dateFormat);
      if (date == preventDayDate) {
        result.value = "вчера";
        return result;
      }
      result.value = this.date;
      return result;
    },
    time() {
      const timeFormat = "HH:mm";
      return moment(this.logItem.created_at).format(timeFormat);
    },
    timeHTML() {
      return `<span class="d-inline time">${this.time} </span>`;
    },
  },
};
</script>

<style lang="scss">
.message {
  color: $color_dark;
}
</style>