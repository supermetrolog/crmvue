<template>
  <div class="company-request-list">
    <div class="row mb-4">
      <div class="col-12 text-center">
        <h4>контакты</h4>
      </div>
    </div>
    <CompanyContactItem
      v-for="(contact, idx) of contacts"
      :key="contact.id"
      :contact="contact"
      :idx="idx"
    />
  </div>
</template>

<script>
import CompanyContactItem from "./CompanyContactItem.vue";
export default {
  name: "CompanyContactList",
  components: {
    CompanyContactItem,
  },
  props: {
    contacts: {
      type: Array,
    },
  },
  mounted() {
    // console.log("anal", this.contacts);
  },
};
</script>

<style>
</style>