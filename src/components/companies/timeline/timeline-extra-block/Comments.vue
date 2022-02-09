<template>
  <div class="comments">
    <div class="reminders">
      <ul class="comments">
        <li v-if="!data.length" class="text-center m-0">
          <p>нет комментариев</p>
        </li>
        <CommentItem
          v-for="comment in data"
          :key="comment.id"
          :data="comment"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import CommentItem from "./CommentItem.vue";
export default {
  name: "Comments",
  components: {
    CommentItem,
  },
  props: {
    data: {
      type: Array,
    },
  },
};
</script>

<style>
</style>