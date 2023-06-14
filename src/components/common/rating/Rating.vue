<template>
  <div class="rating">
    <i
      v-for="value in 5"
      :key="value"
      class="far fa-star"
      :class="{
        'fas fa-star': value <= rating,
        red: value <= rating,
      }"
    >
    </i>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Rating",
  props: {
    rating: {
      type: Number,
      required: true,
    },
  },
});
</script>

<style src="./Rating.scss" lang="scss" />
