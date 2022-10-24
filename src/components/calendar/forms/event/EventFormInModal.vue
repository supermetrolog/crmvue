<template>
  <teleport to="body">
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__zoomIn for__modal absolute"
      leave-active-class="animate__animated animate__zoomOut for__modal absolute"
    >
      <Modal class="autosize" @close="$emit('close')" title="Создание события">
        <EventForm
          :formdata="formdata"
          @created="(...argv) => this.$emit('created', ...argv)"
          @updated="(...argv) => this.$emit('updated', ...argv)"
        />
      </Modal>
    </transition>
  </teleport>
</template>

<script>
import EventForm from "./EventForm.vue";
export default {
  emits: ["close", "updated", "created"],
  name: "EventFormInModal",
  components: {
    EventForm,
  },
  props: {
    formdata: {
      type: Object,
    },
  },
};
</script>

<style>
</style>