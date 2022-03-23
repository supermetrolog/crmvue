<template>
  <div class="col-lg-2 align-self-center text-right">
    <ul class="nav-list horizontal">
      <li
        class="nav-item notification"
        :class="{ active: callsVisible }"
        ref="calls"
      >
        <a class="nav-link" @click.prevent="clickCalls">
          <div
            class="nav-link__content"
            :class="{ 'current-call-exist': CURRENT_CALLS.length }"
          >
            <i class="fas fa-phone-alt"></i>
            <span
              class="badge badge-danger"
              :class="{ 'badge-info': CURRENT_CALLS.length }"
              v-if="CALLS_COUNT != 0 || CURRENT_CALLS.length"
            >
              {{ +CALLS_COUNT }}
            </span>
          </div>
        </a>
        <transition
          mode="out-in"
          enter-active-class="animate__animated animate__fadeInDown for__notifications"
          leave-active-class="animate__animated animate__fadeOutUp for__notifications"
        >
          <Calls v-if="callsVisible" />
        </transition>
      </li>

      <li
        class="nav-item notification"
        :class="{ active: notificationsVisible }"
        ref="notification"
      >
        <a class="nav-link" @click.prevent="clickNotification">
          <div class="nav-link__content">
            <i class="far fa-bell"></i>
            <span class="badge badge-danger" v-if="NOTIFICATIONS_COUNT != 0">
              {{ NOTIFICATIONS_COUNT }}
            </span>
          </div>
        </a>
        <transition
          mode="out-in"
          enter-active-class="animate__animated animate__fadeInDown for__notifications"
          leave-active-class="animate__animated animate__fadeOutUp for__notifications"
        >
          <Notifications v-if="notificationsVisible" />
        </transition>
      </li>
    </ul>
  </div>
</template>

<script>
import Notifications from "@/components/common/layout/main/header/notifications/Notifications.vue";
import Calls from "@/components/common/layout/main/header/calls/Calls.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "v-nav-notif",
  components: { Notifications, Calls },
  data() {
    return {
      notificationsVisible: false,
      callsVisible: false,
    };
  },
  computed: {
    ...mapGetters(["NOTIFICATIONS_COUNT", "CALLS_COUNT", "CURRENT_CALLS"]),
  },
  methods: {
    ...mapActions(["FETCH_NOTIFICATIONS_COUNT", "FETCH_CALLS_COUNT"]),
    clickNotification() {
      this.notificationsVisible = !this.notificationsVisible;
    },
    clickCalls() {
      this.callsVisible = !this.callsVisible;
    },
    close(e) {
      if (!this.$refs.notification.contains(e.target)) {
        this.notificationsVisible = false;
      }
      if (!this.$refs.calls.contains(e.target)) {
        this.callsVisible = false;
      }
    },
  },
  mounted() {
    this.FETCH_NOTIFICATIONS_COUNT();
    this.FETCH_CALLS_COUNT();
    document.addEventListener("click", this.close);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.close);
  },
};
</script>

<style>
</style>