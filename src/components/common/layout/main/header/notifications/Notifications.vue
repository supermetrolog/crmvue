<template>
  <div class="comments-panel">
    <div class="comments-panel__content" :class="{ loading: loader }">
      <div class="row header no-gutters">
        <div class="col-6 title text-left align-self-center">
          <p>Уведомления</p>
        </div>
        <div class="col-6 readAll text-right align-self-center">
          <a href="#" id="readAllButton"> прочитать все </a>
        </div>
      </div>
      <Loader class="center" v-if="loader" />
      <div class="row no-gutters" v-if="!loader">
        <div class="col-12">
          <div class="comments-item">
            <div class="new header" v-if="newNotification.length">
              <p class="text-left title">новые уведомления</p>
            </div>
            <NotificationItem
              v-for="notification of newNotification"
              :key="notification.id"
              :notification="notification"
            />
            <div class="old header" v-if="newNotification.length">
              <p class="title text-left">просмотренные</p>
            </div>
            <NotificationItem
              v-for="notification of oldNotification"
              :key="notification.id"
              :notification="notification"
            />
            <div class="col-12 text-center">
              <Pagination
                :pagination="NOTIFICATIONS_PAGINATION"
                @loadMore="loadMore"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//Передать (модератор) Передать админу только с комментарием - передавать с комментарием всем - Там же переать админу
//Для брокеров только кнопка ОТКАЗ и причина отказа - комментарий (галочки - далбаеб, пидорас, не берет трубку)
//Статистика отказов и причина
import NotificationItem from "./NotificationItem.vue";
import Pagination from "@/components/common/Pagination.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Notifications",
  components: {
    NotificationItem,
    Pagination,
  },
  data() {
    return {
      loader: false,
    };
  },
  props: {
    notifications: {
      type: Array,
      default: null,
    },
  },
  computed: {
    ...mapGetters(["NOTIFICATIONS_PAGINATION"]),
    oldNotification() {
      return this.notifications.filter(
        (item) => item.status != 0 && item.status != -1
      );
    },
    newNotification() {
      return this.notifications.filter(
        (item) => item.status == 0 || item.status == -1
      );
    },
  },
  methods: {
    ...mapActions([
      "INCRIMENT_NOTIFICATIONS_CURRENT_PAGE",
      "FETCH_NOTIFICATIONS",
      "RETURN_NOTIFICATION_CURRENT_PAGE_TO_FIRST",
    ]),
    loadMore() {
      this.INCRIMENT_NOTIFICATIONS_CURRENT_PAGE();
      this.FETCH_NOTIFICATIONS();
    },
  },
  async mounted() {
    // this.dataSharing();
    this.loader = true;
    await this.FETCH_NOTIFICATIONS();
    this.loader = false;
  },
  beforeUnmount() {
    this.RETURN_NOTIFICATION_CURRENT_PAGE_TO_FIRST();
    this.FETCH_NOTIFICATIONS();
  },
};
</script>

<style>
</style>