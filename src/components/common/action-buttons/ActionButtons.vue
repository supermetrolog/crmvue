<template>
  <ul class="action-buttons">
    <li v-if="edit" class="action-buttons__item">
      <teleport to="body">
        <transition
          v-if="object?.objectType?.includes(3)"
          mode="out-in"
          enter-active-class="animate__animated animate__zoomIn for__modal absolute"
          leave-active-class="animate__animated animate__zoomOut for__modal absolute"
        >
          <PlotCreateForm :formData="object" v-if="formIsVisible" @close="toggleFormIsVisible"/>
        </transition>
        <transition
          v-else
          mode="out-in"
          enter-active-class="animate__animated animate__zoomIn for__modal absolute"
          leave-active-class="animate__animated animate__zoomOut for__modal absolute"
        >
          <BuildingCreateForm :formData="object" v-if="formIsVisible" @close="toggleFormIsVisible"/>
        </transition>
      </teleport>
      <button class="action-buttons__button" @click="toggleFormIsVisible">
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
import {PropType, defineComponent} from "vue";
import {IActionButton} from "./action-buttons.interface";
import BuildingCreateForm from "@/components/complex/object-holdings/forms/building-create-form/BuildingCreateForm.vue";
import PlotCreateForm from "@/components/complex/object-holdings/forms/plot-create-form/PlotCreateForm.vue";
import IObject from "@/interfaces/object.interface";

export default defineComponent({
  name: "ActionButtons",
  components: {PlotCreateForm, BuildingCreateForm},
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
    object: {
      type: Object as PropType<IObject>,
      required: true,
    }
  },
  data() {
    return {
      formIsVisible: false,
    };
  },
  methods: {
    toggleFormIsVisible() {
      this.formIsVisible = !this.formIsVisible;
    }
  }
});
</script>

<style lang="scss" src="./ActionButtons.scss"/>
