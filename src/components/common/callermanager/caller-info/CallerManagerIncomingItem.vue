<template>
  <div class="caller-manager__item">
    <CallerManagerIncomingHeader :call="call" />
    <CallerManagerExistContact
      v-if="call.phoneFrom"
      :contact="call.phoneFrom.contact"
    />
    <CallerManagerNotExistContact v-else />
  </div>
</template>

<script>
import CallerManagerIncomingHeader from "./CallerManagerIncomingHeader.vue";
import CallerManagerExistContact from "./CallerManagerExistContact.vue";
import CallerManagerNotExistContact from "./CallerManagerNotExistContact.vue";
export default {
  name: "CallerManagerIncomingItem",
  components: {
    CallerManagerIncomingHeader,
    CallerManagerExistContact,
    CallerManagerNotExistContact,
  },
  props: {
    call: {
      type: Object,
    },
  },
  mounted() {
    console.error(this.call.phoneTo);
  },
};
</script>

<style>
</style>