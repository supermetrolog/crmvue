<template>
    <div class="company-request-list company-contact-list">
        <transition
            mode="out-in"
            enter-active-class="animate__animated animate__zoomIn for__modal absolute"
            leave-active-class="animate__animated animate__zoomOut for__modal absolute"
        >
            <Modal v-if="deletedContactItem" @close="clickCloseModal" title="Удаление контакта" class="autosize">
                <div class="row no-gutters">
                    <div class="col-12 text-center">
                        <h4 class="text-dark">Вы уверены что хотите удалить контакт?</h4>
                        <CompanyContactItem :contact="deletedContactItem" :reedOnly="true" />
                    </div>
                    <div class="col-12 mt-4 text-center">
                        <Loader v-if="deleteLoader" class="center small" />
                        <button
                            @click="deleteContact(deletedContactItem)"
                            class="btn btn-danger"
                            :disabled="deleteLoader"
                        >
                            Удалить
                        </button>
                        <button @click="clickCloseModal" class="btn btn-primary ml-1" :disabled="deleteLoader">
                            Нет
                        </button>
                    </div>
                </div>
            </Modal>
        </transition>
        <CompanyContactItem
            v-for="contact of contacts"
            :key="contact.id"
            @openContactFormForUpdate="openContactFormForUpdate"
            @createComment="createComment"
            @deleteContact="clickDeleteContact"
            :contact="contact"
            :createCommentLoader="createCommentLoader"
        />
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import Modal from '@/components/common/Modal.vue';
import Loader from '@/components/common/Loader.vue';
import CompanyContactItem from '@/components/Company/Contact/CompanyContactItem.vue';

export default {
    name: 'CompanyContactList',
    components: {
        CompanyContactItem,
        Loader,
        Modal
    },
    props: {
        contacts: {
            type: Array
        }
    },
    data() {
        return {
            deletedContactItem: false,
            deleteLoader: false,
            createCommentLoader: false
        };
    },
    methods: {
        ...mapActions(['DELETE_CONTACT', 'CREATE_CONTACT_COMMENT']),
        openContactFormForUpdate(contact) {
            this.$emit('openContactFormForUpdate', contact);
        },
        clickCloseModal() {
            this.deletedContactItem = null;
        },
        clickDeleteContact(contact) {
            this.deletedContactItem = contact;
        },
        async createComment(data) {
            this.createCommentLoader = true;
            await this.CREATE_CONTACT_COMMENT(data);
            this.$emit('createComment');
            this.createCommentLoader = false;
        },
        async deleteContact(contact) {
            this.deleteLoader = true;
            await this.DELETE_CONTACT(contact);
            this.$emit('deleteContact');
            this.deleteLoader = false;
            this.deletedContactItem = null;
        }
    },
    mounted() {},
    emits: ['openContactFormForUpdate', 'createComment', 'deleteContact']
};
</script>

<style></style>