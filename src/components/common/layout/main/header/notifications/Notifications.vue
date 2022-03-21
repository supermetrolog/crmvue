<template>
  <div class="comments-panel">
    <div class="comments-panel__content" :class="{ loading: loader }">
      <div class="row header no-gutters">
        <div class="col-6 title text-left align-self-center">
          <p>Уведомления</p>
        </div>
        <!-- <div class="col-6 readAll text-right align-self-center">
          <a href="#" id="readAllButton" @click.prevent="viewedAll">
            прочитать все
          </a>
        </div> -->
      </div>
      <Loader class="center" v-if="loader" />
      <div class="row no-gutters" v-if="!loader">
        <div class="col-12">
          <div class="comments-item">
            <div class="new header" v-if="NEW_NOTIFICATIONS.length">
              <p class="text-left title">новые уведомления</p>
            </div>
            <NotificationItem
              v-for="notification of NEW_NOTIFICATIONS"
              :key="notification.id"
              :notification="notification"
            />
            <div class="old header" v-if="NOTIFICATIONS.length">
              <p class="title text-left">просмотренные</p>
            </div>
            <NotificationItem
              v-for="notification of NOTIFICATIONS"
              :key="notification.id"
              :notification="notification"
            />
            <div class="col-12 text-center">
              <Pagination :pagination="NOTIFICATIONS_PAGINATION" @next="next" />
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
      query: null,
      newNotifyQuery: null,
    };
  },
  computed: {
    ...mapGetters([
      "NOTIFICATIONS_PAGINATION",
      "THIS_USER",
      "NEW_NOTIFICATIONS",
      "NOTIFICATIONS",
    ]),
  },
  methods: {
    ...mapActions([
      "FETCH_NOTIFICATIONS",
      "RESET_NOTIFICATION",
      "SEARCH_NOTIFICATION",
      "FETCH_NEW_NOTIFICATIONS",
      "VIEWED_ALL_NOTIFICATIONS",
    ]),
    init() {
      this.query = {
        page: 1,
        consultant_id: this.THIS_USER.id,
        status: [1, 2],
      };
      this.newNotifyQuery = {
        "per-page": 0,
        consultant_id: this.THIS_USER.id,
        status: [0, -1],
      };
    },
    next(page) {
      this.query.page = page;
      this.SEARCH_NOTIFICATION({ query: this.query, concat: true });
    },
  },
  async mounted() {
    this.init();
    this.loader = true;
    await this.SEARCH_NOTIFICATION({ query: this.query, concat: true });
    await this.FETCH_NEW_NOTIFICATIONS(this.newNotifyQuery);
    this.VIEWED_ALL_NOTIFICATIONS(this.THIS_USER.id);

    this.loader = false;
  },
  beforeUnmount() {
    this.RESET_NOTIFICATION();
  },
};
</script>

<style>
</style>