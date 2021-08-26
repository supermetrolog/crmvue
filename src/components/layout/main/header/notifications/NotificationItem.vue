<template>
  <div class="row item no-gutters">
    <div class="col-2 avatar text-center">
      <i
        v-if="isSystemNotification"
        :class="notificationTypeList[notification.type]"
      ></i>
      <div v-else class="image-circle">
        <img
          src="@/assets/image/5.jpg"
          alt="Аватарка"
          title="Винидиктов Алексей Владимирович"
          class="img-center"
        />
      </div>
    </div>
    <div class="col-10 message text-left">
      <p class="title">
        {{ notification.title }}
        <small class="time">{{ notification.created_at }}</small>
      </p>
      <p class="text" v-html="notification.body"></p>
      <Actions :type="notification.type" :status="notification.status" />
    </div>
  </div>
</template>

<script>
import { NotificationTypeList } from "@/const/Const";
import Actions from "./Actions.vue";
export default {
  name: "NotificationItem",
  components: {
    Actions,
  },
  data() {
    return {
      notificationTypeList: NotificationTypeList.get("param"),
    };
  },
  computed: {
    isSystemNotification() {
      return this.notification.type < 9 ? true : false;
    },
  },
  props: {
    notification: {
      type: Object,
      default: null,
    },
  },
  methods: {},
};
</script>

<style>
</style>