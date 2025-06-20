<template>
    <div class="company-page container-fluid">
        <teleport to="body">
            <Timeline
                v-if="timelineIsVisible && COMPANY && COMPANY_REQUESTS[0]"
                @close="closeTimeline"
            />
            <CompanyContactModal
                v-if="contactModalIsVisible"
                @close="closeContactModal"
                @start-editing="editContact(viewingContact)"
                @delete-contact="deleteContact(viewingContact)"
                @disable="disableContact(viewingContact)"
                @enable="enableContact(viewingContact)"
                :contact="viewingContact"
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
                @created="fetchCompanyRequests"
                @updated="fetchCompanyRequests"
                :company-id="COMPANY.id"
                :form-data="request"
            />
            <FormCompanyContact
                v-if="contactFormIsVisible"
                @close="closeContactForm"
                @created="getCompanyContacts"
                @updated="getCompanyContacts"
                :company_id="COMPANY.id"
                :formdata="editingContact"
            />
            <FormCompany
                v-if="companyFormIsVisible"
                @close="closeCompanyForm"
                @updated="onCompanyUpdated"
                :form-data="COMPANY"
            />
            <FormCompanyDisable
                v-if="disablingFormIsVisible"
                @close="disablingFormIsVisible = false"
                @disabled="onDisabledCompany"
                :company="COMPANY"
            />
            <FormContactDisable
                v-if="disableContactFormIsVisible"
                @close="closeDisableContactForm"
                @disabled="onDisabledContact"
                :contact="disablingContact"
            />
        </teleport>
        <div class="company-page__wrapper">
            <Loader v-if="companyIsLoading || enableIsLoading" />
            <CompanyBox
                v-if="!companyIsLoading"
                @edit-company="companyFormIsVisible = true"
                @create-contact="createContact"
                @enable="enableCompany(COMPANY.id)"
                @disable="disableCompany"
                @enable-contact="enableContact"
                @disable-contact="disableContact"
                @edit-contact="editContact"
                @delete-contact="deleteContact"
                @open-in-chat="openInChat"
                @create-task="createCompanyTask"
                @schedule-visit="scheduleVisitModalIsVisible = true"
                @schedule-call="scheduleCallModalIsVisible = true"
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
                    @request-cloned="fetchCompanyRequests"
                    @request-disabled="fetchCompanyRequests"
                    @request-updated="onRequestUpdated"
                    :requests="COMPANY_REQUESTS"
                    :deals="COMPANY.dealsRequestEmpty"
                    class="company-page__column mb-2 mb-lg-0"
                />
                <CompanyBoxServices v-if="!companyIsLoading" class="company-page__column" />
            </div>
        </div>
        <button ref="chatButtonEl" @click="openInChat" class="company-page__chat">
            <i class="fa-solid fa-comment" />
        </button>
        <teleport to="body">
            <CallScheduler
                v-if="scheduleCallModalIsVisible"
                @close="scheduleCallModalIsVisible = false"
                @created="scheduleCallModalIsVisible = false"
                :company="COMPANY"
            />
            <VisitScheduler
                v-if="scheduleVisitModalIsVisible"
                @close="scheduleVisitModalIsVisible = false"
                @created="scheduleVisitModalIsVisible = false"
                :company="COMPANY"
            />
        </teleport>
    </div>
</template>

<script setup>
import CompanyBoxRequests from '@/components/Company/Box/CompanyBoxRequests.vue';
import { useStore } from 'vuex';
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
import { useConfirm } from '@/composables/useConfirm.js';
import {
    computed,
    onBeforeMount,
    onUnmounted,
    provide,
    ref,
    shallowRef,
    useTemplateRef,
    watch
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMessenger } from '@/components/Messenger/useMessenger.js';
import { useDocumentTitle } from '@/composables/useDocumentTitle.ts';
import { messenger } from '@/const/messenger.js';
import { useTippyText } from '@/composables/useTippyText.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { useAsync } from '@/composables/useAsync.js';
import api from '@/api/api.js';
import { useNotify } from '@/utils/use/useNotify.js';
import FormCompanyDisable from '@/components/Forms/Company/FormCompanyDisable.vue';
import FormContactDisable from '@/components/Forms/FormContactDisable.vue';
import { contactOptions } from '@/const/options/contact.options.js';
import { useTaskManager } from '@/composables/useTaskManager.js';
import { getCompanyShortName } from '@/utils/formatters/models/company.js';
import VisitScheduler from '@/components/VisitScheduler/VisitScheduler.vue';
import CallScheduler from '@/components/CallScheduler/CallScheduler.vue';

provide('openContact', showContact);
provide('createContactComment', createContactComment);

const store = useStore();
const route = useRoute();
const router = useRouter();
const { openChat } = useMessenger();
const { setTitle } = useDocumentTitle();

// contacts

const { confirm } = useConfirm();

const contactFormIsVisible = ref(false);
const contactModalIsVisible = ref(false);
const disableContactFormIsVisible = ref(false);

const editingContact = shallowRef(null);
const viewingContact = shallowRef(null);
const disablingContact = shallowRef(null);

function editContact(contact) {
    editingContact.value = contact;
    contactFormIsVisible.value = true;
}

function closeContactForm() {
    contactFormIsVisible.value = false;
    editingContact.value = null;
}

function showContact(contact) {
    viewingContact.value = contact;
    contactModalIsVisible.value = true;
}

function closeContactModal() {
    contactModalIsVisible.value = false;
    viewingContact.value = null;
}

function createContact() {
    contactFormIsVisible.value = true;
}

function disableContact(contact) {
    disablingContact.value = contact;
    disableContactFormIsVisible.value = true;
}

function closeDisableContactForm() {
    disableContactFormIsVisible.value = false;
    disablingContact.value = null;
}

function onDisabledContact(payload) {
    disableContactFormIsVisible.value = false;

    disablingContact.value.status = 0;
    Object.assign(disablingContact.value, payload);

    disablingContact.value = null;
}

async function enableContact(contact) {
    const confirmed = await confirm(
        'Восстановить контакт',
        'Вы уверены, что хотите восстановить контакт из архива?'
    );
    if (!confirmed) return;

    contact.isLoading = true;

    await api.contacts.enable(contact.id);

    contact.status = contactOptions.statusStatement.ACTIVE;
    contact.passive_why = null;
    contact.passive_why_comment = null;

    contact.isLoading = false;

    notify.success('Контакт успешно восстановлен.');
}

async function deleteContact(contact) {
    const confirmed = await confirm(
        'Удалить контакт',
        'Вы уверены, что хотите безвозвратно удалить контакт?'
    );
    if (!confirmed) return;

    contact.isLoading = true;

    await store.dispatch('DELETE_CONTACT', contact);

    contact.isLoading = false;

    notify.success('Контакт удален.');
}

//

const companyIsLoading = shallowRef(false);
const requestsIsLoading = shallowRef(false);
const objectsIsLoading = shallowRef(false);
const contactsIsLoading = shallowRef(false);

const requestFormIsVisible = shallowRef(false);
const companyFormIsVisible = shallowRef(false);
const dealFormIsVisible = shallowRef(false);

const request = ref(null);
const company = ref(null);
const deal = ref(null);

const COMPANY = computed(() => store.getters.COMPANY);
const COMPANY_REQUESTS = computed(() => store.getters.COMPANY_REQUESTS);
const COMPANY_CONTACTS = computed(() => store.getters.COMPANY_CONTACTS);
const COMPANY_OBJECTS = computed(() => store.getters.COMPANY_OBJECTS);

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

async function fetchCompanyRequests(withLoader = false) {
    requestsIsLoading.value = withLoader;
    await store.dispatch('FETCH_COMPANY_REQUESTS', route.params.id);
    requestsIsLoading.value = false;
}

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

const closeCompanyForm = () => {
    company.value = null;
    companyFormIsVisible.value = false;
};

const onCompanyUpdated = () => {
    getCompany();
    getCompanyContacts();
};

async function createContactComment(data) {
    await store.dispatch('CREATE_CONTACT_COMMENT', data);
}

const openInChat = () => {
    openChat(COMPANY.value.id, COMPANY.value.id, messenger.dialogTypes.COMPANY);
};

onBeforeMount(() => {
    getCompany(true);
    getCompanyContacts(true);
    getCompanyObjects(true);
    fetchCompanyRequests(true);
});

onUnmounted(() => {
    store.commit('clearCompanyObjectsStore');
});

// tippy

useTippyText(useTemplateRef('chatButtonEl'), 'Открыть в чате');

// request update

function onRequestUpdated(request) {
    const requestIndex = store.state.CompanyRequest.companyRequests.findIndex(
        item => item.id === request.id
    );

    if (requestIndex !== -1) {
        store.state.CompanyRequest.companyRequests.splice(requestIndex, 1, request);
    }
}

// timeline

const timelineIsVisible = ref(false);

watch(
    () => route.query,
    () => {
        timelineIsVisible.value = isNotNullish(route.query.request_id);
    },
    { immediate: true }
);

function closeTimeline() {
    timelineIsVisible.value = false;
    router.push({ name: 'company' });
}

// status

const notify = useNotify();

const { isLoading: enableIsLoading, execute: enableCompany } = useAsync(api.companies.enable, {
    onFetchResponse: () => {
        notify.success('Компания успешно восстановлена.');
        COMPANY.value.status = 1;
        COMPANY.value.status.passive_why = null;
    },
    confirmation: true,
    confirmationContent: {
        title: 'Восстановить компанию',
        message: 'Вы уверены, что хотите восстановить компанию из архива?'
    }
});

const disablingFormIsVisible = ref(false);

function disableCompany() {
    disablingFormIsVisible.value = true;
}

function onDisabledCompany(payload) {
    COMPANY.value.status = 0;
    COMPANY.value.passive_why = payload.passive_why;
    COMPANY.value.passive_why_comment = payload.passive_why_comment;

    disablingFormIsVisible.value = false;

    if (payload.disable_requests) {
        fetchCompanyRequests(false);
    }

    if (payload.disable_contacts) {
        getCompanyContacts(false);
    }
}

// tasks

const isLoading = ref(false);

const { createTaskWithTemplate, createTaskRelation } = useTaskManager();

async function createCompanyTask() {
    let userId;

    if (COMPANY.value.consultant_id) {
        userId = COMPANY.value.consultant_id;
    }

    const taskPayload = await createTaskWithTemplate({
        title: `Компания ${getCompanyShortName(COMPANY.value)}`,
        user_id: userId,
        relations: [createTaskRelation('company', COMPANY.value.id)]
    });

    if (!taskPayload) return;

    try {
        isLoading.value = true;

        const task = await api.task.create(taskPayload);

        notify.success('Задача успешно создана!');
    } finally {
        isLoading.value = false;
    }
}

const scheduleCallModalIsVisible = ref(false);
const scheduleVisitModalIsVisible = ref(false);
</script>
