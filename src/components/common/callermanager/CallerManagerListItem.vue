<template>
  <div class="caller-manager__list__item" @click="$emit('clickItem', call)">
    <div>
      <p class="phone">{{ phone }}</p>
    </div>
    <div>
      <p class="name">{{ name }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "CallerManagerListItem",
  props: {
    call: {
      type: Object,
    },
  },
  computed: {
    remoteCaller() {
      return this.call.phoneTo || this.call.phoneFrom;
    },

    phone() {
      if (this.remoteCaller) {
        return this.remoteCaller.phone;
      }

      if (this.call.type == 1) {
        return this.call.from;
      }
      return this.call.to;
    },

    name() {
      if (this.remoteCaller) {
        return this.remoteCaller.contact.first_and_last_name;
      }
      return "нет в базе";
    },
  },
};
</script>

<style>
</style>