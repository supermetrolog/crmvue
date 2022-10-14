<template>
  <li>
    <div class="row no-gutters reminders-list-item m-0">
      <div
        class="col-12"
        :class="{
          main: date.type,
          noMain: !date.type,
        }"
      >
        <p class="time" v-if="date.type">{{ date.value }}</p>
      </div>
      <div class="col-12 mb-1" :class="{ 'text-right': isSystemComment }">
        <p
          class="text-success"
          :class="{
            'text-success_alt': isSystemComment,
          }"
        >
          {{ data.title || "&#8212;" }}
        </p>
      </div>

      <div class="col-12 comment">
        <p v-html="timeHTML + data.comment"></p>
      </div>
    </div>
  </li>
</template>

<script>
import moment from "moment";
export default {
  name: "CommentItem",
  data() {
    return {};
  },
  props: {
    data: {
      type: Object,
    },
    preventComment: {
      type: Object,
    },
  },
  computed: {
    isSystemComment() {
      if (!this.data.title) {
        return true;
      }
      if (this.data.title.includes("система")) {
        return true;
      }
      return false;
    },

    date() {
      // const dateFormat = "YYYY-MM-DDTHH:mm:ss";
      const result = {
        value: null,
        type: 1,
      };
      const dateFormat = "YYYY-MM-DD";
      const timeFormat = "HH:mm";
      let date = moment(this.data.created_at).format(dateFormat);

      if (this.preventComment) {
        let preventDate = moment(this.preventComment.created_at).format(
          dateFormat
        );
        if (date == preventDate) {
          result.value = moment(this.data.created_at).format(timeFormat);
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
      result.value = this.data.created_at_format;
      return result;
    },
    time() {
      const timeFormat = "HH:mm";
      return moment(this.data.created_at).format(timeFormat);
    },
    timeHTML() {
      return `<span class="d-inline time">${this.time} </span>`;
    },
  },
};
</script>

<style>
</style>