<template>
  <ul class="action-buttons">
    <li v-if="edit" class="action-buttons__item">
      <button class="action-buttons__button">
        <i class="fas fa-pen"></i>
      </button>
    </li>
    <li v-if="advert" class="action-buttons__item">
      <button
        class="action-buttons__button action-buttons__button_advert"
        :class="{ active: advert.value }"
      >
        <i class="fas fa-rocket"></i>
      </button>
    </li>
    <li v-if="pdf" class="action-buttons__item">
      <button class="action-buttons__button">
        <i class="fas fa-file-pdf"></i>
      </button>
    </li>
    <li v-if="favorite" class="action-buttons__item">
      <button
        class="action-buttons__button action-buttons__button_favorite"
        :class="{ active: favorite.value }"
      >
        <i class="fas fa-star"></i>
      </button>
    </li>
    <li v-if="notifications" class="action-buttons__item">
      <button
        class="action-buttons__button action-buttons__button_notifications"
        :class="{ active: notifications.value }"
      >
        <i class="fas fa-bell"></i>
      </button>
    </li>
    <li v-if="dislike" class="action-buttons__item">
      <button
        class="action-buttons__button action-buttons__button_dislike"
        :class="{ active: dislike.value }"
      >
        <i class="fas fa-thumbs-down"></i>
      </button>
    </li>
  </ul>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue";
import { IActionButton } from "./action-buttons.interface";

export default defineComponent({
  name: "ActionButtons",
  components: {},
  props: {
    edit: {
      type: Object as PropType<IActionButton>,
    },
    advert: {
      type: Object as PropType<IActionButton>,
    },
    pdf: {
      type: Object as PropType<IActionButton>,
    },
    favorite: {
      type: Object as PropType<IActionButton>,
    },
    notifications: {
      type: Object as PropType<IActionButton>,
    },
    dislike: {
      type: Object as PropType<IActionButton>,
    },
  },
  data() {
    return {};
  },
  methods: {},
});
</script>

<style lang="scss" src="./ActionButtons.scss" />
