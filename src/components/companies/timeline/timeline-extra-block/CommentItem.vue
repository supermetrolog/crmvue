<template>
  <li>
    <div class="row no-gutters reminders-list-item m-0">
      <div class="col-12 text-center">
        <i class="far fa-clock d-inline-block mr-1"></i>
        <p class="time">{{ data.created_at }}</p>
      </div>
      <div class="col-12 mb-1" :class="{ 'text-right': isSystemComment }">
        <p
          class="text-success"
          :class="{
            'text-success_alt': isSystemComment,
          }"
        >
          {{ data.title || "&#8212;" }}
        </p>
      </div>

      <div class="col-12 comment">
        <p v-html="data.comment"></p>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  name: "CommentItem",
  props: {
    data: {
      type: Object,
    },
  },
  computed: {
    isSystemComment() {
      if (!this.data.title) {
        return true;
      }
      if (this.data.title.includes("система")) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style>
</style>