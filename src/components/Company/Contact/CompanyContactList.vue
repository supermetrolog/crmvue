<template>
    <div class="company-request-list company-contact-list">
        <AnimationTransition>
            <Modal
                v-if="deletedContactItem"
                @close="clickCloseModal"
                title="Удаление контакта"
                class="modal-form-company-contact-remove"
            >
                <div class="row no-gutters">
                    <div class="col-12 text-center">
                        <h4 class="text-dark">Вы уверены что хотите удалить контакт?</h4>
                        <CompanyContactItem :contact="deletedContactItem" :reed-only="true" />
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
                        <button
                            @click="clickCloseModal"
                            class="btn btn-primary ml-1"
                            :disabled="deleteLoader"
                        >
                            Нет
                        </button>
                    </div>
                </div>
            </Modal>
        </AnimationTransition>
        <CompanyContactItem
            v-for="contact of contacts"
            :key="contact.id"
            @openContactFormForUpdate="openContactFormForUpdate"
            @createComment="createComment"
            @deleteContact="clickDeleteContact"
            :contact="contact"
            :create-comment-loader="createCommentLoader"
        />
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import Modal from '@/components/common/Modal.vue';
import Loader from '@/components/common/Loader.vue';
import CompanyContactItem from '@/components/Company/Contact/CompanyContactItem.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

export default {
    name: 'CompanyContactList',
    components: {
        AnimationTransition,
        CompanyContactItem,
        Loader,
        Modal
    },
    emits: ['openContactFormForUpdate', 'createComment', 'deleteContact'],
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
    mounted() {}
};
</script>

<style></style>
