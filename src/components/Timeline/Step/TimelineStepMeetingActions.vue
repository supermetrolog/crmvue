<template>
    <div class="step-action">
        <teleport to="body">
            <FormCompanyRequest
                v-if="companyRequestFormVisible"
                @closeCompanyForm="clickCloseCompanyRequestForm"
                @updated="updatedRequest"
                :formdata="currentRequest"
            />
            <FormCompanyContact
                v-if="companyContactFormVisible"
                @closeCompanyForm="clickCloseCompanyContactForm"
                @updated="getCompanyContacts"
                :company_id="COMPANY.id"
                :formdata="editContact"
            />
            <FormCompany
                v-if="companyFormVisible"
                @closeCompanyForm="clickCloseCompanyForm"
                @updated="updatedCompany"
                :formdata="COMPANY"
            />
        </teleport>
        <div class="row no-gutters">
            <div class="col-12">
                <div class="row no-gutters inner scroller">
                    <div class="col-12 mx-auto">
                        <div class="timeline-actions row">
                            <TimelineStepMeeting
                                @updateItem="clickUpdateStep"
                                @stageChanged="changeStage"
                                :step="step"
                                :disabled="disabled"
                            />
                        </div>
                    </div>

                    <div
                        v-if="(COMPANY && step.additional != 1) || currentStage === 1"
                        class="col-12 mx-auto row mt-4 pl-0"
                    >
                        <Loader v-if="loaderCompany" class="center small" />

                        <div class="col-9 pl-0">
                            <CompanyDetailInfoAlternative
                                @openCompanyFormForUpdate="companyFormVisible = true"
                                :company="COMPANY"
                            />
                        </div>
                        <div class="col-3 company-request-list company-contact-list">
                            <CompanyContactItem
                                v-for="contact of COMPANY_CONTACTS"
                                :key="contact.id"
                                @openContactFormForUpdate="openContactFormForUpdate"
                                @createComment="createComment"
                                @deleteContact="clickDeleteContact"
                                :contact="contact"
                            />
                        </div>
                    </div>
                    <div
                        v-if="currentRequest && step.additional == 1 && currentStage !== 1"
                        class="col-12 mx-auto mt-4 p-3"
                    >
                        <Loader v-if="loaderCompanyRequests" class="center small" />
                        <div class="mb-2">
                            <strong>{{ currentRequest.name || 'Запрос' + ' #' + currentRequest.id }}</strong>
                        </div>
                        <CompanyRequestItemAlt
                            @openCompanyRequestFormForUpdate="companyRequestFormVisible = true"
                            :request="currentRequest"
                            :edit-only="true"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { MixinStepActions } from '@/components/Timeline/mixins.js';
import FormCompanyContact from '@/components/Forms/Company/FormCompanyContact.vue';
import FormCompanyRequest from '@/components/Forms/Company/FormCompanyRequest.vue';
import FormCompany from '@/components/Forms/Company/FormCompany.vue';
import Loader from '@/components/common/Loader.vue';
import TimelineStepMeeting from '@/components/Timeline/Step/TimelineStepMeeting.vue';
import CompanyContactItem from '@/components/Company/Contact/CompanyContactItem.vue';
import CompanyDetailInfoAlternative from '@/components/Company/CompanyDetailInfoAlternative.vue';
import CompanyRequestItemAlt from '@/components/Company/Request/CompanyRequestItemAlt.vue';

export default {
    name: 'MeetingActions',
    components: {
        CompanyRequestItemAlt,
        CompanyDetailInfoAlternative,
        CompanyContactItem,
        TimelineStepMeeting,
        Loader,
        FormCompany,
        FormCompanyRequest,
        FormCompanyContact
    },
    mixins: [MixinStepActions],
    data() {
        return {
            companyRequestFormVisible: false,
            loaderCompanyRequests: false,
            companyFormVisible: false,
            loaderCompany: false,
            companyContactFormVisible: false,
            editContact: null,
            currentStage: null
        };
    },
    computed: {
        ...mapGetters(['COMPANY_REQUESTS', 'COMPANY', 'COMPANY_CONTACTS']),
        currentRequest() {
            if (Array.isArray(this.COMPANY_REQUESTS)) {
                return this.COMPANY_REQUESTS.find(item => item.id == this.$route.query.request_id);
            }
            return false;
        }
    },
    methods: {
        ...mapActions([
            'FETCH_COMPANY_REQUESTS',
            'FETCH_COMPANY',
            'FETCH_COMPANY_CONTACTS',
            'DELETE_CONTACT',
            'CREATE_CONTACT_COMMENT',
            'ADD_TO_TRANSITION_LIST'
        ]),
        updatedRequest() {
            this.getCompanyRequests();
        },
        updatedCompany() {
            this.getCompany();
            this.getCompanyContacts(false);
        },
        async getCompany() {
            this.loaderCompany = true;
            await this.FETCH_COMPANY(this.$route.params.id);
            this.loaderCompany = false;
        },
        async getCompanyRequests() {
            this.loaderCompanyRequests = true;
            await this.FETCH_COMPANY_REQUESTS(this.$route.params.id);
            this.loaderCompanyRequests = false;
        },
        clickCloseCompanyRequestForm() {
            this.companyRequestFormVisible = false;
        },
        clickOpenCompanyForm() {
            this.companyFormVisible = true;
        },
        clickCloseCompanyForm() {
            this.companyFormVisible = false;
        },
        async getCompanyContacts(withLoader = true) {
            this.loaderCompanyContacts = withLoader;
            await this.FETCH_COMPANY_CONTACTS(this.$route.params.id);
            this.loaderCompanyContacts = false;
        },

        openContactFormForUpdate(contact) {
            this.editContact = contact;
            this.clickOpenCompanyContactForm();
        },
        clickCloseCompanyContactForm() {
            this.companyContactFormVisible = false;
            this.editContact = null;
        },
        clickOpenCompanyContactForm() {
            this.companyContactFormVisible = true;
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
        },
        changeStage(stage) {
            this.currentStage = stage;
        }
    },
    async created() {
        this.getCompanyContacts();
    },
    emits: ['updateStep']
};
</script>

<style></style>
