<template>
  <div class="col-lg-3 align-self-center text-right">
    <ul class="nav-list horizontal">
      <li
        class="nav-item comments"
        :class="{
          active: commentsVisible,
        }"
      >
        <a href="#" class="nav-link" @click="getComments">
          <div class="nav-link__content">
            <i class="far fa-comments"></i>
            <span class="badge badge-warning"> 12 </span>
          </div>
        </a>
        <vComments v-if="commentsVisible" :comments="comments" />
      </li>

      <li
        class="nav-item notification"
        :class="{ active: notificationsVisible }"
      >
        <a class="nav-link" @click.prevent="clickNotification">
          <div class="nav-link__content">
            <i class="far fa-bell"></i>
            <span class="badge badge-danger" v-if="count">
              {{ count }}
            </span>
          </div>
        </a>
        <transition
          mode="out-in"
          enter-active-class="animate__animated animate__fadeInDown for__notifications"
          leave-active-class="animate__animated animate__fadeOutUp for__notifications"
        >
          <Notifications
            v-if="notificationsVisible"
            :notifications="this.NOTIFICATIONS"
          />
        </transition>
      </li>
    </ul>
  </div>
</template>

<script>
import vComments from "./comments/v-comments.vue";
import Notifications from "@/components/layout/main/header/notifications/Notifications.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "v-nav-notif",
  components: { vComments, Notifications },
  data() {
    return {
      commentsVisible: false,
      notificationsVisible: false,
    };
  },
  computed: {
    ...mapGetters(["NOTIFICATIONS"]),
    count() {
      return this.NOTIFICATIONS.filter(
        (item) => item.status == 0 || item.status == -1
      ).length;
    },
  },
  methods: {
    ...mapActions(["FETCH_NOTIFICATIONS", "VIEWED"]),
    async getComments() {
      this.commentsVisible = !this.commentsVisible;
    },
    clickNotification() {
      this.notificationsVisible = !this.notificationsVisible;
      if (!this.notificationsVisible) {
        this.VIEWED();
        this.countVisible = true;
      } else {
        this.countVisible = false;
      }
    },
    deleteComment(comment) {
      this.comments = this.comments.filter((item) => item !== comment);
    },
    getNotification() {
      this.FETCH_NOTIFICATIONS();
    },
  },
  mounted() {
    this.getNotification();
  },
};
</script>

<style>
</style>