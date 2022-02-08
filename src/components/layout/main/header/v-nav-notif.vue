<template>
  <div class="col-lg-2 align-self-center text-right">
    <ul class="nav-list horizontal">
      <li
        class="nav-item notification"
        :class="{ active: callsVisible || newCurrentCallFlag }"
      >
        <a class="nav-link" @click.prevent="clickCalls">
          <div class="nav-link__content">
            <i class="fas fa-phone-alt"></i>
            <span
              class="badge badge-danger"
              :class="{ 'badge-info': CURRENT_CALLS.length }"
              v-if="CURRENT_CALLS.length || calls_count"
            >
              {{ calls_count ? calls_count : CURRENT_CALLS.length }}
            </span>
          </div>
        </a>
        <transition
          mode="out-in"
          enter-active-class="animate__animated animate__fadeInDown for__notifications"
          leave-active-class="animate__animated animate__fadeOutUp for__notifications"
        >
          <Calls
            v-if="callsVisible || newCurrentCallFlag"
            :newCurrentCallFlag="newCurrentCallFlag"
            :currentCalls="CURRENT_CALLS"
            :calls="CALLS"
          />
        </transition>
      </li>

      <li
        class="nav-item notification"
        :class="{ active: notificationsVisible }"
      >
        <a class="nav-link" @click.prevent="clickNotification">
          <div class="nav-link__content">
            <i class="far fa-bell"></i>
            <span class="badge badge-danger" v-if="notif_count">
              {{ notif_count }}
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
            :notifications="NOTIFICATIONS"
          />
        </transition>
      </li>
    </ul>
  </div>
</template>

<script>
import Notifications from "@/components/layout/main/header/notifications/Notifications.vue";
import Calls from "@/components/layout/main/header/calls/Calls.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "v-nav-notif",
  components: { Notifications, Calls },
  data() {
    return {
      commentsVisible: false,
      notificationsVisible: false,
      callsVisible: false,
      newCurrentCallFlag: false,
    };
  },
  computed: {
    ...mapGetters([
      "NOTIFICATIONS",
      "NEW_NOTIFICATIONS",
      "CURRENT_CALLS",
      "CALLS",
    ]),
    notif_count() {
      if (!this.NOTIFICATIONS) {
        return 0;
      }
      return this.NOTIFICATIONS.filter(
        (item) => item.status == 0 || item.status == -1
      ).length;
    },
    calls_count() {
      if (!this.CALLS) {
        return 0;
      }
      return this.CALLS.filter(
        (item) => item.viewed != 2 && item.status !== null
      ).length;
    },
  },
  methods: {
    ...mapActions([
      "FETCH_NOTIFICATIONS",
      "VIEWED_NOTIFICATIONS",
      "FETCH_CALLS",
      "VIEWED_CALLS",
    ]),
    async getComments() {
      this.commentsVisible = !this.commentsVisible;
    },
    clickNotification() {
      this.notificationsVisible = !this.notificationsVisible;
      if (!this.notificationsVisible) {
        this.VIEWED_NOTIFICATIONS();
      }
    },
    clickCalls() {
      if (this.newCurrentCallFlag) {
        this.newCurrentCallFlag = false;
      } else {
        this.callsVisible = !this.callsVisible;
        if (!this.callsVisible) {
          this.VIEWED_CALLS();
        }
      }
    },
    deleteComment(comment) {
      this.comments = this.comments.filter((item) => item !== comment);
    },
    getNotification() {
      this.FETCH_NOTIFICATIONS();
    },
    getCalls() {
      this.FETCH_CALLS();
    },
  },
  watch: {
    CURRENT_CALLS(before, after) {
      if (before.length != after.length) {
        this.getCalls();
        if (before.length > after.length) {
          this.newCurrentCallFlag = true;
        } else {
          this.newCurrentCallFlag = false;
        }
      }
    },
    NEW_NOTIFICATIONS(before, after) {
      if (before.length != after.length) {
        this.getNotification();
      }
    },
  },
  mounted() {
    this.getNotification();
    this.getCalls();
  },
};
</script>

<style>
</style>