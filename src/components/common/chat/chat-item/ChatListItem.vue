<template>
  <div class="ChatListItem">
    <div class="ChatListItem-date" :class="{
      main: date.type,
      noMain: !date.type,
    }">
      <p v-if="date.type">{{ date.value }}</p>
    </div>
    <div class="ChatListItem-user" v-if="!isSameUser">
      <i>
        {{ item.user || "&#8212;" }}
      </i>
    </div>
    <div class="ChatListItem-body">
      <div class="ChatListItem-message">
        <div class="ChatListItem-reply" v-if="item.type == 2">
          <div class="vertical-reply-line" />
          <div class="ChatListItem-reply-content">
            <span class="ChatListItem-reply-title">{{ replyData.title }}</span>
            <span class="ChatListItem-reply-text">{{ replyData.body }}</span>
          </div>
        </div>
        <span v-html="item.message" class="ChatListItem-message-text"></span>
      </div>
      <div class="ChatListItem-time">
        {{ time }}
      </div>
    </div>
    <!-- <a class="d-inline text-primary ml-2" :href="'/letters/'">посмотреть</a> -->
  </div>
</template>

<script>
import moment from "moment";
import "./styles.scss";

export default {
  name: "ChatListItem",
  props: {
    item: {
      type: Object,
      required: true,
    },
    preventItem: {
      type: Object,
    },
    questionsTree: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    };
  },
  computed: {
    date() {
      const result = {
        value: null,
        type: 1,
      };
      const dateFormat = "DD.MM.YYYY";
      const timeFormat = "HH:mm";
      let date = moment(this.item.created_at).format(dateFormat);

      if (this.preventItem) {
        let preventDate = moment(this.preventItem.created_at).format(
          dateFormat
        );
        if (date == preventDate) {
          result.value = moment(this.item.created_at).format(timeFormat);
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
      if (this.preventItem?.user === this.item.user && !this.date.type) {
        return true;
      } else {
        return false;
      }
    },
    time() {
      const timeFormat = "HH:mm";
      return moment(this.item.created_at).format(timeFormat);
    },
    replyData() {
      if (this.item.type == 2) {
        let replyItem = {
          title: 'Вопрос',
          body: this.questionsTree.find(parent => parent.id == this.item.question_parent).questionsList.find(quest => quest.id == this.item.question_id).body,
        };
        return replyItem;
      } else {
        return null;
      }
    }
  },
};
</script>