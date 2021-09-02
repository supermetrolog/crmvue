<template>
  <div class="company-request-list company-contact-list">
    <Modal
      title="Удаление контакта "
      @close="clickCloseModal"
      v-if="deletedContactItem"
    >
      <div class="row no-gutters">
        <div class="col-12 text-center">
          <h4 class="text-dark">
            Вы уверены что хотите удалить контакт
            <span class="text-grey">"{{ deletedContactItem.header }}"</span>
            ?
          </h4>
        </div>
        <div class="col-12 mt-4 text-center">
          <Loader class="center small" v-if="deleteLoader" />
          <button
            class="btn btn-danger"
            :disabled="deleteLoader"
            @click="deleteContact(deletedContactItem)"
          >
            Удалить
          </button>
          <button
            class="btn btn-primary ml-1"
            @click="clickCloseModal"
            :disabled="deleteLoader"
          >
            Нет
          </button>
        </div>
      </div>
    </Modal>
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
      :createCommentLoader="createCommentLoader"
      @openContactFormForUpdate="openContactFormForUpdate"
      @createComment="createComment"
      @deleteContact="clickDeleteContact"
    />
  </div>
</template>

<script>
import CompanyContactItem from "./CompanyContactItem.vue";
import Modal from "@/components/Modal";
import Loader from "@/components/Loader";
import { mapActions } from "vuex";
export default {
  name: "CompanyContactList",
  components: {
    CompanyContactItem,
    Modal,
    Loader,
  },
  data() {
    return {
      deletedContactItem: false,
      deleteLoader: false,
      createCommentLoader: false,
    };
  },
  props: {
    contacts: {
      type: Array,
    },
  },
  methods: {
    ...mapActions(["DELETE_CONTACT", "CREATE_CONTACT_COMMENT"]),
    openContactFormForUpdate(contact) {
      this.$emit("openContactFormForUpdate", contact);
    },
    clickCloseModal() {
      this.deletedContactItem = null;
    },
    clickDeleteContact(contact) {
      console.log(contact);
      this.deletedContactItem = contact;
    },
    async createComment(data) {
      this.createCommentLoader = true;
      await this.CREATE_CONTACT_COMMENT(data);
      this.createCommentLoader = false;
    },
    async deleteContact(contact) {
      this.deleteLoader = true;
      await this.DELETE_CONTACT(contact);
      this.deleteLoader = false;
      this.deletedContactItem = null;
    },
  },
  mounted() {
    // console.log("anal", this.contacts);
  },
  emits: ["openContactFormForUpdate"],
};
</script>

<style>
</style>