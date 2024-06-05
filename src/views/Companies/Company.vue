<template>
    <div class="company">
        <p v-if="!loaderCompanyDetailInfo && COMPANY.status === 0" class="company-passive">
            <span>Пассив</span>
            <span v-if="COMPANY.passive_why !== null"> ({{ passiveWhyList[COMPANY.passive_why].label }})</span>
            <span v-if="COMPANY.passive_why_comment !== null"> комм: {{ COMPANY.passive_why_comment }}</span>
        </p>
        <teleport to="body">
            <Timeline
                v-if="timelineVisible && COMPANY && COMPANY_REQUESTS[0]"
                @close="closeTimeline"
            />
        </teleport>
        <FormCompanyDeal
            v-if="dealFormVisible"
            @close="clickCloseDealForm"
            @updated="updatedDeal"
            :formdata="deal"
        />
        <FormCompanyRequest
            v-if="companyRequestFormVisible"
            @closeCompanyForm="clickCloseCompanyRequestForm"
            @created="createdRequest"
            @updated="updatedRequest"
            :company_id="COMPANY.id"
            :formdata="request"
        />
        <FormCompanyContact
            v-if="companyContactFormVisible"
            @closeCompanyForm="clickCloseCompanyContactForm"
            @created="createdContact"
            @updated="updatedContact"
            :company_id="COMPANY.id"
            :formdata="contact"
        />
        <FormCompany
            v-if="companyFormVisible"
            @closeCompanyForm="clickCloseCompanyForm"
            @updated="updatedCompany"
            :formdata="COMPANY"
        />
        <CompanyContactModal
            v-if="contactModalVisible"
            @closeContactModal="clickCloseContactModal"
            @clickEditContact="openContactFormForUpdate"
            :contact="contact"
        />
        <div class="company-wrapper">
            <Loader v-if="loaderCompanyDetailInfo"></Loader>
            <CompanyBox
                v-if="!loaderCompanyDetailInfo"
                @editCompany="clickOpenCompanyForm"
                @createContact="openContactFormForCreate"
                :company="COMPANY"
                :contacts="COMPANY_CONTACTS"
            />
            <CompanyBoxLogs v-if="!loaderCompanyDetailInfo" :company="COMPANY" />
            <CompanyBoxObjects v-if="!loaderCompanyObjects" :objects="COMPANY_OBJECTS" />
            <CompanyBoxRequests
                v-if="!loaderCompanyRequests"
                @openDealFormForUpdate="openDealFormForUpdate"
                @dealDeleted="getCompany(false)"
                @clickCreateRequest="clickOpenCompanyRequestForm"
                @openCompanyRequestFormForUpdate="openCompanyRequestFormForUpdate"
                @requestCloned="getCompanyRequests"
                @requestDisabled="getCompanyRequests"
                :requests="companyRequests"
                :deals="COMPANY.dealsRequestEmpty"
                :loading="loaderCompanyRequests"
            />
            <CompanyBoxServices v-if="!loaderCompanyDetailInfo" />
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

export default {
    name: 'Company',
    components: {
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
            editContact: contact => this.openContactFormForUpdate(contact),
            createContactComment: data => this.createContactComment(data)
        };
    },
    data() {
        return {
            loaderCompanyDetailInfo: true,
            loaderCompanyRequests: true,
            loaderCompanyContacts: true,
            loaderCompanyObjects: true,
            companyRequestFormVisible: false,
            companyContactFormVisible: false,
            contactModalVisible: false,
            companyFormVisible: false,
            dealFormVisible: false,
            timelineVisible: false,
            request: null,
            contact: null,
            company: null,
            deal: null,
            loading: null
        };
    },
    computed: {
        ...mapGetters([
            'COMPANY',
            'COMPANY_REQUESTS',
            'COMPANY_CONTACTS',
            'COMPANY_OBJECTS',
            'TIMELINE_LIST'
        ]),
        passiveWhyList: () => PassiveWhy,
        companyRequests() {
            return this.COMPANY_REQUESTS;
        }
    },
    watch: {
        $route() {
            this.timeline();
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
            this.loaderCompanyDetailInfo = withLoader;
            await this.FETCH_COMPANY(this.$route.params.id);
            this.loaderCompanyDetailInfo = false;
            if (!this.COMPANY) {
                this.$router.replace('/not-found');
                return;
            }
            this.ADD_TO_TRANSITION_LIST(this.COMPANY);
        },
        async getCompanyRequests() {
            this.loaderCompanyRequests = true;
            await this.FETCH_COMPANY_REQUESTS(this.$route.params.id);
            this.loaderCompanyRequests = false;
        },
        async getCompanyContacts(withLoader = true) {
            this.loaderCompanyContacts = withLoader;
            await this.FETCH_COMPANY_CONTACTS(this.$route.params.id);
            this.loaderCompanyContacts = false;
        },
        async getCompanyObjects(withLoader = true) {
            this.loaderCompanyObjects = withLoader;
            await this.FETCH_COMPANY_OBJECTS(this.$route.params.id);
            this.loaderCompanyObjects = false;
        },
        openCompanyFormForUpdate(company) {
            this.company = company;
            this.clickOpenCompanyForm();
        },
        clickCloseCompanyForm() {
            this.companyFormVisible = false;
            this.company = null;
        },
        clickOpenCompanyForm() {
            this.companyFormVisible = true;
        },
        clickCloseCompanyRequestForm() {
            this.companyRequestFormVisible = false;
            this.request = null;
        },
        clickOpenCompanyRequestForm() {
            this.companyRequestFormVisible = true;
        },
        openCompanyRequestFormForUpdate(request) {
            this.request = request;
            this.clickOpenCompanyRequestForm();
        },
        clickOpenDealForm() {
            this.dealFormVisible = true;
        },
        clickCloseDealForm() {
            this.dealFormVisible = false;
            this.deal = null;
        },
        openDealFormForUpdate(deal) {
            this.deal = deal;
            this.clickOpenDealForm();
        },
        openContact(contact) {
            this.contactModalVisible = true;
            this.contact = contact;
            // this.openContactFormForUpdate(contact);
        },
        clickCloseContactModal() {
            this.contactModalVisible = false;
        },
        openContactFormForUpdate(contact) {
            this.contact = contact;
            this.clickOpenCompanyContactForm();
        },
        clickCloseCompanyContactForm() {
            this.companyContactFormVisible = false;

            this.contact = null;
        },
        openContactFormForCreate() {
            this.contact = null;
            this.clickOpenCompanyContactForm();
        },
        clickOpenCompanyContactForm() {
            this.contactModalVisible = false;
            this.companyContactFormVisible = true;
        },
        createdRequest() {
            this.getCompanyRequests();
        },
        updatedRequest() {
            this.getCompanyRequests();
        },
        updatedDeal() {
            this.getCompany(false);
        },
        createdContact() {
            this.getCompanyContacts();
        },
        updatedContact() {
            this.getCompanyContacts();
        },
        updatedCompany() {
            this.getCompany();
            this.getCompanyContacts(false);
        },
        timeline() {
            if (this.$route.query.request_id) {
                this.timelineVisible = true;
            } else {
                this.timelineVisible = false;
            }
        },
        closeTimeline() {
            this.timelineVisible = false;
            this.$router.push({ name: 'company' });
        },
        async createContactComment(data) {
            await this.CREATE_CONTACT_COMMENT(data);
        }
    },
    mounted() {
        this.getCompany();
        this.getCompanyContacts();
        this.getCompanyObjects();
        this.getCompanyRequests();
        this.timeline();
    }
};
</script>
