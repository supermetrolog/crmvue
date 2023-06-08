<template>
  <ul class="action-buttons">
    <li v-if="edit !== undefined" class="action-buttons__item">
      <button class="action-buttons__button">
        <i class="fas fa-pen"></i>
      </button>
    </li>
    <li v-if="advert !== undefined" class="action-buttons__item">
      <button
        class="action-buttons__button action-buttons__button_advert"
        :class="{ active: advert }"
      >
        <i class="fas fa-rocket"></i>
      </button>
    </li>
    <li v-if="pdf !== undefined" class="action-buttons__item">
      <button class="action-buttons__button">
        <i class="fas fa-file-pdf"></i>
      </button>
    </li>
    <li v-if="favorite !== undefined" class="action-buttons__item">
      <button
        class="action-buttons__button action-buttons__button_favorite"
        :class="{ active: favorite }"
      >
        <i class="fas fa-star"></i>
      </button>
    </li>
    <li v-if="notifications !== undefined" class="action-buttons__item">
      <button
        class="action-buttons__button action-buttons__button_notifications"
        :class="{ active: notifications }"
      >
        <i class="fas fa-bell"></i>
      </button>
    </li>
    <li v-if="dislike !== undefined" class="action-buttons__item">
      <button
        class="action-buttons__button action-buttons__button_dislike"
        :class="{ active: dislike }"
      >
        <i class="fas fa-thumbs-down"></i>
      </button>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ActionButtons",
  components: {},
  props: {
    edit: {
      type: Boolean,
    },
    advert: {
      type: Boolean,
    },
    pdf: {
      type: Boolean,
    },
    favorite: {
      type: Boolean,
    },
    notifications: {
      type: Boolean,
    },
    dislike: {
      type: Boolean,
    },
  },
  data() {
    return {};
  },
});
</script>

<style lang="scss" src="./ActionButtons.scss" />
