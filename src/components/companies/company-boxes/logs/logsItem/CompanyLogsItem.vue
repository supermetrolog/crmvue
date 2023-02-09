<template>
  <div class="CompanyLogsItem">
    <div
      class="CompanyLogsItem-date"
      :class="{
        main: date.type,
        noMain: !date.type,
      }"
    >
      <p v-if="date.type">{{ date.value }}</p>
    </div>
    <div class="CompanyLogsItem-user" v-if="!isSameUser">
      <i class="text-dark">
        {{ logItem.user || "&#8212;" }}
      </i>
    </div>
    <div class="CompanyLogsItem-message">
      <span class="CompanyLogsItem-message-time">{{ time }}</span>
      <span
        v-html="logItem.message"
        class="CompanyLogsItem-message-text"
      ></span>
      <!-- <a class="d-inline text-primary ml-2" :href="'/letters/'">посмотреть</a> -->
    </div>
  </div>
</template>

<script>
import moment from "moment";
import "./styles.scss";

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
    date() {
      const result = {
        value: null,
        type: 1,
      };
      const dateFormat = "DD.MM.YYYY";
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
      result.value = date;
      return result;
    },
    isSameUser() {
      if (this.preventLogItem?.user === this.logItem.user && !this.date.type) {
        return true;
      } else {
        return false;
      }
    },
    time() {
      const timeFormat = "HH:mm";
      return moment(this.logItem.created_at).format(timeFormat);
    },
  },
};
</script>