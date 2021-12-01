<template>
  <div class="comments-panel calls">
    <div class="comments-panel__content">
      <div class="row header no-gutters">
        <div class="col-6 title text-left align-self-center">
          <p>Звонки</p>
        </div>
        <div class="col-6 readAll text-right align-self-center">
          <a href="#" id="readAllButton"> прочитать все </a>
        </div>
      </div>
      <div class="row no-gutters">
        <div class="col-12">
          <div class="comments-item">
            <div class="new header" v-if="currentCalls.length">
              <p class="text-left title">текущие звонки</p>
            </div>
            <CallItem
              v-for="call of currentCalls"
              :key="call.id"
              :call="call"
            />
            <div class="old header" v-if="newCalls.length">
              <p class="text-left title">новые звонки</p>
            </div>
            <CallItem v-for="call of newCalls" :key="call.id" :call="call" />
            <div class="new header" v-if="oldCalls.length">
              <p class="text-left title">просмотренные</p>
            </div>
            <CallItem v-for="call of oldCalls" :key="call.id" :call="call" />
            <div class="col-12 text-center">
              <Pagination :pagination="CALLS_PAGINATION" @loadMore="loadMore" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CallItem from "./CallItem.vue";
import Pagination from "@/components/Pagination.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Calls",
  components: {
    CallItem,
    Pagination,
  },
  props: {
    currentCalls: {
      type: Array,
    },
    calls: {
      type: Array,
      default: null,
    },
  },
  computed: {
    ...mapGetters(["CALLS_PAGINATION"]),
    oldCalls() {
      return this.calls.filter((item) => item.viewed == 2);
    },
    newCalls() {
      return this.calls.filter(
        (item) => item.viewed != 2 && item.status !== null
      );
    },
  },
  methods: {
    ...mapActions([
      "INCRIMENT_CALLS_CURRENT_PAGE",
      "FETCH_CALLS",
      "FETCH_CALLS_NO_INTERVAL",
      "RETURN_CALLS_CURRENT_PAGE_TO_FIRST",
    ]),
    loadMore() {
      this.INCRIMENT_CALLS_CURRENT_PAGE();
      this.FETCH_CALLS_NO_INTERVAL();
    },
  },
  beforeUnmount() {
    console.warn("UNMOUNT");
    this.RETURN_CALLS_CURRENT_PAGE_TO_FIRST();
    this.FETCH_CALLS_NO_INTERVAL();
  },
  watch: {
    currentCalls(before, after) {
      if (before.length != after.length) {
        this.FETCH_CALLS_NO_INTERVAL();
        console.log("FUCK");
      }
    },
  },
};
</script>

<style>
</style>