<template>
  <div class="row item no-gutters">
    <div class="col-2 avatar">
      <div class="image-circle">
        <img
          src="../../../../../assets/image/5.jpg"
          alt="Аватарка"
          title="Винидиктов Алексей Владимирович"
          class="img-center"
        />
      </div>
    </div>
    <div class="col-10 message text-left">
      <p class="description">
        оставил(а) комментарий к договору
        <a href="#" class="agreement-number"> № {{ comment.agreementId }} </a>
      </p>
      <a href="#" class="comments-link">
        <p class="text">
          {{ comment.body }}
        </p>
      </a>

      <p class="time">{{ comment.datetime }}</p>
      <a href="#" class="delete-link" @click="$emit('delete-comment', item)">
        <div class="delete"></div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "v-comments-item",
  props: {
    comment: {
      type: Object,
      default: null,
    },
  },
  methods: {},
};
</script>

<style>
</style>