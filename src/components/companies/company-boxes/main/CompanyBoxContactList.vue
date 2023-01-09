<template>
  <strong
    >Контакты
    <small
      class="CompanyBoxContactList-create"
      @click="this.$emit('clickCreateContact')"
      >[создать]</small
    ></strong
  >
  <div class="CompanyBoxContactList">
    <CompanyBoxContactListItem
      v-for="contact in contacts"
      :key="contact.id"
      :contact="contact"
    />
  </div>
</template>

<script>
import CompanyBoxContactListItem from "./CompanyBoxContactListItem.vue";
export default {
  name: "CompanyBoxContactList",
  props: {
    contacts: {
      type: Array,
      required: true,
    },
  },
  components: {
    CompanyBoxContactListItem,
  },
  emits: ["clickCreateContact"],
};
</script>