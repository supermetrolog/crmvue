<template>
    <div class="company-page">
        <teleport to="body">
            <Timeline
                v-if="timelineIsVisible && COMPANY && COMPANY_REQUESTS[0]"
                @close="closeTimeline"
            />
            <CompanyContactModal
                v-if="contactModalIsVisible"
                @close="contactModalIsVisible = false"
                @start-editing="updateContact"
                :contact="contact"
            />
        </teleport>
        <FormCompanyDeal
            v-if="dealFormIsVisible"
            @close="closeDealForm"
            @updated="onDealUpdated"
            :formdata="deal"
        />
        <FormCompanyRequest
            v-if="requestFormIsVisible"
            @closeCompanyForm="closeRequestForm"
            @created="getCompanyRequests"
            @updated="getCompanyRequests"
            :company_id="COMPANY.id"
            :formdata="request"
        />
        <FormCompanyContact
            v-if="contactFormIsVisible"
            @closeCompanyForm="closeContactForm"
            @created="getCompanyContacts"
            @updated="getCompanyContacts"
            :company_id="COMPANY.id"
            :formdata="contact"
        />
        <FormCompany
            v-if="companyFormIsVisible"
            @closeCompanyForm="closeCompanyForm"
            @updated="onCompanyUpdated"
            :formdata="COMPANY"
        />
        <DashboardChip
            v-if="!companyIsLoading && COMPANY.status === 0"
            class="company-page__chip dashboard-bg-danger text-white w-100 mb-2"
        >
            <div class="d-flex align-items-center justify-content-center">
                <p>Пассив</p>
                <i
                    v-if="COMPANY.passive_why !== null"
                    v-tippy="passiveWhyComment"
                    class="fa-regular fa-question-circle ml-2 icon"
                />
            </div>
        </DashboardChip>
        <div class="company-page__wrapper">
            <Loader v-if="companyIsLoading"></Loader>
            <CompanyBox
                v-if="!companyIsLoading"
                @edit-company="companyFormIsVisible = true"
                @create-contact="createContact"
                :company="COMPANY"
                :contacts="COMPANY_CONTACTS"
                class="mb-2"
            />
            <div class="company-page__row">
                <CompanyBoxObjects
                    v-if="!objectsIsLoading"
                    :objects="COMPANY_OBJECTS"
                    class="company-page__column"
                />
                <CompanyBoxRequests
                    v-if="!requestsIsLoading"
                    @update-deal="updateDeal"
                    @deal-deleted="getCompany(false)"
                    @create-request="requestFormIsVisible = true"
                    @update-request="updateRequest"
                    @request-cloned="getCompanyRequests"
                    @request-disabled="getCompanyRequests"
                    :requests="COMPANY_REQUESTS"
                    :deals="COMPANY.dealsRequestEmpty"
                    class="company-page__column"
                />
                <CompanyBoxServices v-if="!companyIsLoading" class="company-page__column" />
            </div>
        </div>
    </div>
</template>

<script>
import CompanyBoxRequests from '@/components/Company/Box/CompanyBoxRequests.vue';
import { mapActions, mapGetters } from 'vuex';
import { PassiveWhy } from '@/const/const.js';
import Loader from '@/components/common/Loader.vue';
import FormCompany from '@/components/Forms/Company/FormCompany.vue';
import FormCompanyContact from '@/components/Forms/Company/FormCompanyContact.vue';
import FormCompanyDeal from '@/components/Forms/Company/FormCompanyDeal.vue';
import CompanyBoxObjects from '@/components/Company/Box/CompanyBoxObjects.vue';
import CompanyContactModal from '@/components/Company/Contact/CompanyContactModal.vue';
import CompanyBoxLogs from '@/components/Company/Box/CompanyBoxLogs.vue';
import CompanyBox from '@/components/Company/Box/CompanyBox.vue';
import FormCompanyRequest from '@/components/Forms/Company/FormCompanyRequest.vue';
import Timeline from '@/components/Timeline/Timeline.vue';
import CompanyBoxServices from '@/components/Company/Box/CompanyBoxServices.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';

export default {
    name: 'Company',
    components: {
        DashboardChip,
        CompanyBoxServices,
        Timeline,
        FormCompanyRequest,
        CompanyBox,
        CompanyBoxLogs,
        CompanyBoxRequests,
        CompanyContactModal,
        CompanyBoxObjects,
        FormCompanyDeal,
        FormCompanyContact,
        FormCompany,
        Loader
    },
    provide() {
        return {
            openContact: contact => this.openContact(contact),
            editContact: contact => this.updateContact(contact),
            createContactComment: data => this.createContactComment(data)
        };
    },
    data() {
        return {
            companyIsLoading: false,
            requestsIsLoading: false,
            contactsIsLoading: false,
            objectsIsLoading: false,

            requestFormIsVisible: false,
            contactFormIsVisible: false,
            companyFormIsVisible: false,
            dealFormIsVisible: false,
            timelineIsVisible: false,
            contactModalIsVisible: false,

            request: null,
            contact: null,
            company: null,
            deal: null
        };
    },
    computed: {
        ...mapGetters(['COMPANY', 'COMPANY_REQUESTS', 'COMPANY_CONTACTS', 'COMPANY_OBJECTS']),
        passiveWhyComment() {
            let text = PassiveWhy[this.COMPANY.passive_why].label;
            if (this.COMPANY.passive_why_comment) text += ': ' + this.COMPANY.passive_why_comment;
            return text;
        }
    },
    watch: {
        $route: {
            handler() {
                if (this.$route.query.request_id) this.timelineIsVisible = true;
                else this.timelineIsVisible = false;
            },
            immediate: true
        }
    },
    methods: {
        ...mapActions([
            'FETCH_COMPANY',
            'FETCH_COMPANY_REQUESTS',
            'FETCH_COMPANY_CONTACTS',
            'FETCH_COMPANY_OBJECTS',
            'ADD_TO_TRANSITION_LIST',
            'CREATE_CONTACT_COMMENT'
        ]),
        async getCompany(withLoader = true) {
            this.companyIsLoading = withLoader;
            await this.FETCH_COMPANY(this.$route.params.id);
            this.companyIsLoading = false;

            if (!this.COMPANY) {
                this.$router.replace('/not-found');
                return;
            }

            this.ADD_TO_TRANSITION_LIST(this.COMPANY);
        },
        async getCompanyRequests() {
            this.requestsIsLoading = true;
            await this.FETCH_COMPANY_REQUESTS(this.$route.params.id);
            this.requestsIsLoading = false;
        },
        async getCompanyContacts(withLoader = true) {
            this.contactsIsLoading = withLoader;
            await this.FETCH_COMPANY_CONTACTS(this.$route.params.id);
            this.contactsIsLoading = false;
        },
        async getCompanyObjects(withLoader = true) {
            this.objectsIsLoading = withLoader;
            await this.FETCH_COMPANY_OBJECTS(this.$route.params.id);
            this.objectsIsLoading = false;
        },
        openContact(contact) {
            this.contactModalIsVisible = true;
            this.contact = contact;
        },
        updateContact(contact) {
            this.contact = contact;
            this.showContactForm();
        },
        createContact() {
            this.contact = null;
            this.showContactForm();
        },
        showContactForm() {
            this.contactModalIsVisible = false;
            this.contactFormIsVisible = true;
        },
        updateDeal(deal) {
            this.deal = deal;
            this.dealFormIsVisible = true;
        },
        updateRequest(request) {
            this.request = request;
            this.requestFormIsVisible = true;
        },
        closeDealForm() {
            this.dealFormIsVisible = false;
            this.deal = null;
        },
        onDealUpdated() {
            this.getCompany(false);
        },
        closeRequestForm() {
            this.requestFormIsVisible = false;
            this.request = null;
        },
        closeContactForm() {
            this.contactFormIsVisible = false;
            this.contact = null;
        },
        closeCompanyForm() {
            this.companyFormIsVisible = false;
            this.company = null;
        },
        onCompanyUpdated() {
            this.getCompany();
            this.getCompanyContacts(false);
        },
        closeTimeline() {
            this.timelineIsVisible = false;
            this.$router.push({ name: 'company' });
        },
        async createContactComment(data) {
            await this.CREATE_CONTACT_COMMENT(data);
        }
    },
    created() {
        this.getCompany();
        this.getCompanyContacts();
        this.getCompanyObjects();
        this.getCompanyRequests();
    }
};
</script>
