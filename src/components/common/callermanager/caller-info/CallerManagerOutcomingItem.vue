<template>
  <div class="caller-manager__item">
    <CallerManagerOutcomingHeader :call="call" />
    <CallerManagerExistContact
      v-if="call.phoneTo"
      :contact="call.phoneTo.contact"
    />
    <CallerManagerNotExistContact v-else />
  </div>
</template>

<script>
import CallerManagerOutcomingHeader from "./CallerManagerOutcomingHeader.vue";
import CallerManagerExistContact from "./CallerManagerExistContact.vue";
import CallerManagerNotExistContact from "./CallerManagerNotExistContact.vue";
export default {
  name: "CallerManagerOutcomingItem",
  components: {
    CallerManagerOutcomingHeader,
    CallerManagerExistContact,
    CallerManagerNotExistContact,
  },
  props: {
    call: {
      type: Object,
    },
  },

  mounted() {
  },
};
</script>

<style>
</style>