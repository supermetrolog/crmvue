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
            <template v-if="!newCurrentCallFlag">
              <div class="old header" v-if="newCalls.length">
                <p class="text-left title">новые звонки</p>
              </div>
              <CallItem
                v-for="call of newCalls"
                :key="call.id"
                :call="call"
                @refreshCallList="FETCH_CALLS"
              />
              <div class="old header" v-if="oldCalls.length">
                <p class="text-left title">просмотренные</p>
              </div>
              <CallItem
                v-for="call of oldCalls"
                :key="call.id"
                :call="call"
                @refreshCallList="FETCH_CALLS"
              />
              <div class="col-12 text-center">
                <Pagination
                  :pagination="CALLS_PAGINATION"
                  @loadMore="loadMore"
                />
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CallItem from "./CallItem.vue";
import Pagination from "@/components/common/Pagination.vue";
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
    newCurrentCallFlag: {
      type: Boolean,
      default: false,
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
      "RETURN_CALLS_CURRENT_PAGE_TO_FIRST",
    ]),
    loadMore() {
      this.INCRIMENT_CALLS_CURRENT_PAGE();
      this.FETCH_CALLS();
    },
  },
  mounted() {
    this.FETCH_CALLS();
  },
  beforeUnmount() {
    this.RETURN_CALLS_CURRENT_PAGE_TO_FIRST();
    this.FETCH_CALLS();
  },
};
</script>

<style>
</style>