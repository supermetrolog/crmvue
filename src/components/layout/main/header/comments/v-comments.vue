<template>
  <div class="comments-panel">
    <div class="comments-panel__content">
      <div class="row header no-gutters">
        <div class="col-6 title text-left align-self-center">
          <p>Комментарии</p>
        </div>
        <div class="col-6 readAll text-right align-self-center">
          <a href="#" id="readAllButton"> прочитать все </a>
        </div>
      </div>
      <div class="comments-item">
        <vCommentsItem
          v-for="comment of comments"
          :key="comment.id"
          :comment="comment"
          @delete-comment="$emit('delete-comment', comment)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import vCommentsItem from "./v-comments-item";
export default {
  name: "comments",
  components: {
    vCommentsItem,
  },
  props: {
    comments: {
      type: Array,
      default: null,
    },
  },
  methods: {},
};
</script>

<style>
</style>