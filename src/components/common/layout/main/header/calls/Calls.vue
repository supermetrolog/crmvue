<template>
  <div class="comments-panel">
    <div class="comments-panel__content" :class="{ loading: loader }">
      <div class="row header no-gutters">
        <div class="col-6 title text-left align-self-center">
          <p>Уведомления</p>
        </div>
        <div class="col-6 readAll text-right align-self-center">
          <a href="#" @click.prevent="viewedAll"> прочитать все </a>
        </div>
      </div>
      <Loader class="center" v-if="loader" />
      <div class="row no-gutters" v-if="!loader">
        <div class="col-12">
          <div class="comments-item">
            <div class="new header">
              <p class="text-left title">новые уведомления</p>
            </div>
            <div class="new header mt-4 mb-5" v-if="!newCall.length">
              <p class="text-center title no-data">нет новых</p>
            </div>
            <CallItem
              v-for="call of newCall"
              :key="call.id"
              :call="call"
              isNew
            />
            <div class="old header" v-if="oldCall.length">
              <p class="title text-left">просмотренные</p>
            </div>
            <CallItem v-for="call of oldCall" :key="call.id" :call="call" />
            <div class="col-12 text-center">
              <Pagination :pagination="CALLS_PAGINATION" @next="next" />
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
import CallItem from "./CallItem.vue";
import Pagination from "@/components/common/Pagination.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Calls",
  components: {
    CallItem,
    Pagination,
  },
  data() {
    return {
      loader: false,
      query: null,
    };
  },
  computed: {
    ...mapGetters(["CALLS_PAGINATION", "THIS_USER", "CALLS"]),
    oldCall() {
      return this.CALLS.filter(
        (item) => item.status != 0 && item.status != -1 && item.status != 3
      );
    },
    newCall() {
      return this.CALLS.filter(
        (item) => item.status == 0 || item.status == -1 || item.status == 3
      );
    },
  },
  methods: {
    ...mapActions([
      "FETCH_CALLS",
      "RESET_CALLS",
      "SEARCH_CALLS",
      "VIEWED_NOT_COUNT_CALLS",
      "VIEWED_ALL_CALLS",
      "FETCH_CALLS_COUNT_POOL",
    ]),
    init() {
      this.query = {
        page: 1,
        caller_id: this.THIS_USER.userProfile.caller_id,
      };
    },
    async next(page) {
      this.query.page = page;
      await this.SEARCH_CALLS({ query: this.query, concat: true });
      this.FETCH_CALLS_COUNT_POOL(this.THIS_USER.userProfile.caller_id);
    },
    async viewedAll() {
      console.log("viewed all");
      this.loader = true;
      await this.VIEWED_ALL_CALLS(this.THIS_USER.userProfile.caller_id);
      this.RESET_CALLS();
      await this.next(1);
      this.loader = false;
    },
  },
  async mounted() {
    this.init();
    this.loader = true;
    await this.SEARCH_CALLS({ query: this.query, concat: true });
    this.FETCH_CALLS_COUNT_POOL(this.THIS_USER.userProfile.caller_id);

    this.loader = false;
  },
  beforeUnmount() {
    this.RESET_CALLS();
    this.VIEWED_NOT_COUNT_CALLS(this.THIS_USER.userProfile.caller_id);
  },
};
</script>

<style>
</style>