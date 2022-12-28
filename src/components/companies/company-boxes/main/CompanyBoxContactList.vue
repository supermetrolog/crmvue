<template>
  <strong
    >Контакты
    <small
      @click="this.$emit('clickCreateContact')"
      style="color: blue; font-size: 12px"
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