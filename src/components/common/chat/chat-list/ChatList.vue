<template>
  <div class="ChatList" :class="[target]">
    <InfiniteLoading class="loader" top v-bind="$attrs" :target="`.${target}`">
      <template #complete><span></span></template>
    </InfiniteLoading>
    <div class="ChatList-empty" v-if="itemsCount == 0">
      <span>Будьте первым!</span>
      <span>Не оставлено ни единого комментария.</span>
    </div>
    <ChatListItem
      v-for="(item, idx) in formattedItems"
      :key="item.id"
      class="result"
      :item="item"
      :preventItem="getPreventItem(idx)"
      :questionsTree="questionsTree"
    />
    <div class="ChatList-scroll"></div>
  </div>
</template>

<script>
import ChatListItem from "../chat-item/ChatListItem.vue";
import InfiniteLoading from "v3-infinite-loading";
import { logHandler } from "../utils";
import "./styles.scss";
import "v3-infinite-loading/lib/style.css";

export default {
  name: "ChatList",
  components: { InfiniteLoading, ChatListItem },
  props: {
    items: {
      type: Array,
      required: true,
    },
    itemsCount: {
      type: Number,
      default: 1,
    },
    target: {
      type: String,
      default: "infinite-loading",
    },
    questionsTree: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    formattedItems() {
      return logHandler.logListFormat(this.items);
    },
    lastMessage() {
      let [result] = this.formattedItems.slice(-1);
      return result;
    },
  },
  methods: {
    getPreventItem(index) {
      if (!index) {
        return null;
      }
      if (
        Array.isArray(this.formattedItems) &&
        this.formattedItems[index - 1]
      ) {
        return this.formattedItems[index - 1];
      }
    },
    lastMessageScroll(b) {
      let e = document.querySelector(".ChatList-scroll");
      if (!e) return;

      e.scrollIntoView({
        behavior: b || "auto",
        block: "end",
      });
    },
  },
  watch: {
    lastMessage: {
      handler: function (newItem, oldItem) {
        if (newItem?.id !== oldItem?.id) {
          this.lastMessageScroll();
        }
      },
      deep: true,
    },
  },
  beforeMount() {
    this.$emit("chatMounted");
  },
};
</script>