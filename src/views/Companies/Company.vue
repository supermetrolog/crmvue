<template>
    <div class="company-page container-fluid">
        <teleport to="body">
            <Timeline
                v-if="timelineIsVisible && COMPANY && COMPANY_REQUESTS[0]"
                @close="closeTimeline"
            />
            <CompanyContactModal
                v-if="contactModalIsVisible"
                @close="contactModalIsVisible = false"
                @start-editing="showContactForm"
                @delete-contact="deleteContact"
                :contact="contact"
            />
            <FormCompanyDeal
                v-if="dealFormIsVisible"
                @close="closeDealForm"
                @updated="onDealUpdated"
                :formdata="deal"
            />
            <FormCompanyRequest
                v-if="requestFormIsVisible"
                @close="closeRequestForm"
                @created="getCompanyRequests"
                @updated="getCompanyRequests"
                :company-id="COMPANY.id"
                :form-data="request"
            />
            <FormCompanyContact
                v-if="contactFormIsVisible"
                @close="closeContactForm"
                @created="getCompanyContacts"
                @updated="getCompanyContacts"
                :company_id="COMPANY.id"
                :formdata="contact"
            />
            <FormCompany
                v-if="companyFormIsVisible"
                @close="closeCompanyForm"
                @updated="onCompanyUpdated"
                :form-data="COMPANY"
            />
        </teleport>
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
            <Loader v-if="companyIsLoading" />
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
                    @load="loadObjects"
                    :objects="COMPANY_OBJECTS"
                    class="company-page__column mb-2 mb-lg-0"
                />
                <CompanyBoxRequests
                    v-if="!requestsIsLoading && !companyIsLoading"
                    @update-deal="updateDeal"
                    @deal-deleted="getCompany(false)"
                    @create-request="requestFormIsVisible = true"
                    @update-request="updateRequest"
                    @request-cloned="getCompanyRequests"
                    @request-disabled="getCompanyRequests"
                    :requests="COMPANY_REQUESTS"
                    :deals="COMPANY.dealsRequestEmpty"
                    class="company-page__column mb-2 mb-lg-0"
                />
                <CompanyBoxServices v-if="!companyIsLoading" class="company-page__column" />
            </div>
        </div>
        <button v-tippy="'Открыть в чате'" @click="openInChat" class="company-page__chat">
            <i class="fa-solid fa-comment" />
        </button>
    </div>
</template>

<script setup>
import CompanyBoxRequests from '@/components/Company/Box/CompanyBoxRequests.vue';
import { useStore } from 'vuex';
import { PassiveWhy } from '@/const/const.js';
import Loader from '@/components/common/Loader.vue';
import FormCompany from '@/components/Forms/Company/FormCompany.vue';
import FormCompanyContact from '@/components/Forms/Company/FormCompanyContact.vue';
import FormCompanyDeal from '@/components/Forms/Company/FormCompanyDeal.vue';
import CompanyBoxObjects from '@/components/Company/Box/CompanyBoxObjects.vue';
import CompanyContactModal from '@/components/Company/Contact/CompanyContactModal.vue';
import CompanyBox from '@/components/Company/Box/CompanyBox.vue';
import FormCompanyRequest from '@/components/Forms/Company/FormCompanyRequest.vue';
import Timeline from '@/components/Timeline/Timeline.vue';
import CompanyBoxServices from '@/components/Company/Box/CompanyBoxServices.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import { computed, onBeforeMount, onUnmounted, provide, ref, shallowRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMessenger } from '@/components/Messenger/useMessenger.js';
import { useDocumentTitle } from '@/composables/useDocumentTitle.js';
import { messenger } from '@/const/messenger.js';

provide('openContact', openContact);
provide('createContactComment', createContactComment);

const store = useStore();
const route = useRoute();
const router = useRouter();
const { confirm } = useConfirm();
const { openChat } = useMessenger();
const { setTitle } = useDocumentTitle();

const companyIsLoading = shallowRef(false);
const requestsIsLoading = shallowRef(false);
const objectsIsLoading = shallowRef(false);
const contactsIsLoading = shallowRef(false);

const requestFormIsVisible = shallowRef(false);
const contactFormIsVisible = shallowRef(false);
const companyFormIsVisible = shallowRef(false);
const dealFormIsVisible = shallowRef(false);
const timelineIsVisible = shallowRef(false);
const contactModalIsVisible = shallowRef(false);

const request = ref(null);
const contact = ref(null);
const company = ref(null);
const deal = ref(null);

const COMPANY = computed(() => store.getters.COMPANY);
const COMPANY_REQUESTS = computed(() => store.getters.COMPANY_REQUESTS);
const COMPANY_CONTACTS = computed(() => store.getters.COMPANY_CONTACTS);
const COMPANY_OBJECTS = computed(() => store.getters.COMPANY_OBJECTS);

const passiveWhyComment = computed(() => {
    let text = PassiveWhy[COMPANY.value.passive_why].label;
    if (COMPANY.value.passive_why_comment) text += ': ' + COMPANY.value.passive_why_comment;
    return text;
});

watch(
    () => route.query,
    () => {
        timelineIsVisible.value = !!route.query.request_id;
    },
    { immediate: true }
);

watch(
    () => COMPANY.value?.id,
    value => {
        if (value) {
            const title = [COMPANY.value.full_name, `Компания #${COMPANY.value.id}`];

            setTitle(title);
        }
    },
    { immediate: true }
);

const getCompany = async (withLoader = false) => {
    companyIsLoading.value = withLoader;
    await store.dispatch('FETCH_COMPANY', route.params.id);
    companyIsLoading.value = false;

    if (!COMPANY.value) {
        await router.replace('/not-found');
        return;
    }

    await store.dispatch('ADD_TO_TRANSITION_LIST', COMPANY.value);
};

const getCompanyRequests = async (withLoader = false) => {
    requestsIsLoading.value = withLoader;
    await store.dispatch('FETCH_COMPANY_REQUESTS', route.params.id);
    requestsIsLoading.value = false;
};

const getCompanyContacts = async (withLoader = false) => {
    contactsIsLoading.value = withLoader;
    await store.dispatch('FETCH_COMPANY_CONTACTS', route.params.id);
    contactsIsLoading.value = false;
};

const getCompanyObjects = async (withLoader = false) => {
    objectsIsLoading.value = withLoader;
    await store.dispatch('FETCH_COMPANY_OBJECTS', route.params.id);
    objectsIsLoading.value = false;
};

const loadObjects = async $state => {
    const isLastPage = await store.dispatch('loadCompanyObjects', route.params.id);
    if (isLastPage) $state.complete();
    else $state.loaded();
};

function openContact(_contact) {
    contact.value = _contact;
    contactModalIsVisible.value = true;
}

const showContactForm = () => {
    contactModalIsVisible.value = false;
    contactFormIsVisible.value = true;
};

const createContact = () => {
    contact.value = null;
    showContactForm();
};

const updateDeal = _deal => {
    deal.value = _deal;
    dealFormIsVisible.value = true;
};

const updateRequest = _request => {
    request.value = _request;
    requestFormIsVisible.value = true;
};

const closeDealForm = () => {
    deal.value = null;
    dealFormIsVisible.value = false;
};

const onDealUpdated = () => {
    getCompany();
};

const closeRequestForm = () => {
    requestFormIsVisible.value = false;
    request.value = null;
};

const closeContactForm = () => {
    contactFormIsVisible.value = false;
    contact.value = null;
};

const closeCompanyForm = () => {
    company.value = null;
    companyFormIsVisible.value = false;
};

const onCompanyUpdated = () => {
    getCompany();
    getCompanyContacts();
};

const closeTimeline = () => {
    timelineIsVisible.value = false;
    router.push({ name: 'company' });
};

async function createContactComment(data) {
    await store.dispatch('CREATE_CONTACT_COMMENT', data);
}

const deleteContact = async () => {
    const confirmed = await confirm(
        'Удалить контакт',
        'Вы уверены, что хотите безвозвратно удалить контакт?'
    );
    if (confirmed) await store.dispatch('DELETE_CONTACT', contact.value);
};

const openInChat = () => {
    openChat(COMPANY.value.id, COMPANY.value.id, messenger.dialogTypes.COMPANY);
};

onBeforeMount(() => {
    getCompany(true);
    getCompanyContacts(true);
    getCompanyObjects(true);
    getCompanyRequests(true);
});

onUnmounted(() => {
    store.commit('clearCompanyObjectsStore');
});
</script>
