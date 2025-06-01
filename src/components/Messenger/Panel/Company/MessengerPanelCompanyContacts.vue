<template>
    <div>
        <div v-if="isLoading" class="messenger-panel-company__list">
            <MessengerDialogRequestSkeleton v-for="i in lastRenderedObjectCount()" :key="i" />
        </div>
        <EmptyData v-else-if="!activeContacts.length" no-rounded>
            <template #default>Активные контакты не найдены..</template>
            <template #actions>
                <UiButton
                    @click="addContact"
                    color="success-light"
                    icon="fa-solid fa-user-plus"
                    small
                >
                    Добавить контакт
                </UiButton>
            </template>
        </EmptyData>
        <UiButton
            v-if="!isLoading"
            @click="addContact"
            color="success-light"
            icon="fa-solid fa-user-plus"
            class="w-100 br-0"
            center
        >
            Добавить контакт
        </UiButton>
        <VirtualDragList
            v-if="activeContacts.length"
            v-show="!isLoading"
            ref="virtualList"
            v-model="activeContacts"
            disabled
            data-key="id"
            class="messenger-panel-company__list"
            :keeps="20"
        >
            <template #item="{ record }">
                <MessengerQuizContact
                    @click="showContact(record.id)"
                    @edit="editContact(record)"
                    @show-comments="showComments(record)"
                    :contact="record"
                    class="messenger-panel-company__contact"
                />
            </template>
        </VirtualDragList>
        <teleport to="body">
            <UiModal
                v-model:visible="commentsModalIsOpen"
                :title="`Просмотр комментариев (${comments?.length})`"
                :width="600"
            >
                <MessengerQuizContactsComments
                    @updated="onUpdatedComment"
                    @deleted="onDeletedComment"
                    @created="onCreatedComment"
                    :comments
                    :contact="viewedCommentsContact"
                />
            </UiModal>
            <UiModal
                v-model:visible="contactModalIsVisible"
                :title="`Просмотр контакта #${viewedContactId}`"
                :width="700"
                :min-height="240"
            >
                <SurveyCardContactPreview :contact-id="viewedContactId" />
            </UiModal>
            <FormCompanyContact
                v-if="formIsVisible"
                @close="closeForm"
                @created="onContactCreated"
                @updated="onContactUpdated"
                :formdata="updatingContact"
                :company_id="companyId"
            />
        </teleport>
    </div>
</template>
<script setup>
import EmptyData from '@/components/common/EmptyData.vue';
import MessengerDialogRequestSkeleton from '@/components/Messenger/Dialog/MessengerDialogRequestSkeleton.vue';
import VirtualDragList from 'vue-virtual-draglist';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { computed, inject, onBeforeMount, ref, shallowRef, watch } from 'vue';
import api from '@/api/api.js';
import MessengerQuizContact from '@/components/MessengerQuiz/MessengerQuizContact.vue';
import MessengerQuizContactsComments from '@/components/MessengerQuiz/MessengerQuizContactsComments.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import { spliceById } from '@/utils/helpers/array/spliceById.js';
import FormCompanyContact from '@/components/Forms/Company/FormCompanyContact.vue';
import { contactOptions } from '@/const/options/contact.options.js';
import { useStore } from 'vuex';
import SurveyCardContactPreview from '@/components/SurveyCard/SurveyCardContactPreview.vue';
import { isActiveContact, isPersonalContact } from '@/utils/helpers/models/contact.js';
import UiButton from '@/components/common/UI/UiButton.vue';

const props = defineProps({
    companyId: {
        type: Number,
        required: true
    }
});

const lastRenderedObjectCount = inject('lastRenderedObjectCount');
const setLastRendererObjectCount = inject('setLastRendererObjectCount');

const { isLoading } = useDelayedLoader();

const contacts = ref([]);

watch(isLoading, value => {
    if (!value) setLastRendererObjectCount(Math.min(contacts.value.length, 3) || 1);
});

async function fetchContacts() {
    isLoading.value = true;

    try {
        contacts.value = await api.contacts.getByCompany(props.companyId);
    } finally {
        isLoading.value = false;
    }
}

const activeContacts = computed(() =>
    contacts.value.filter(contact => isActiveContact(contact) && isPersonalContact(contact))
);

onBeforeMount(fetchContacts);

// comments

const commentsModalIsOpen = ref(false);
const viewedCommentsContact = shallowRef(null);
const comments = shallowRef([]);

function showComments(contact) {
    viewedCommentsContact.value = contact;

    comments.value = contact.comments;
    commentsModalIsOpen.value = true;
}

function onDeletedComment(commentId) {
    spliceById(comments.value, commentId);
}

function onUpdatedComment(comment) {
    const commentIndex = comments.value.findIndex(element => element.id === comment.id);
    if (commentIndex !== -1) Object.assign(comments.value[commentIndex], comment);
}

function onCreatedComment(comment) {
    comments.value.push(comment);
}

// update contact

const formIsVisible = ref(false);
const updatingContact = shallowRef(null);

const store = useStore();

function onContactCreated() {
    fetchContacts();
    store.dispatch('Messenger/onPanelContactCreated');
}

async function onContactUpdated(_, contact) {
    const contactIndex = contacts.value.findIndex(element => element.id === contact.id);

    if (contactIndex !== -1) {
        if (contact.status === contactOptions.statusStatement.PASSIVE)
            contacts.value.splice(contactIndex, 1);
        else Object.assign(contacts.value[contactIndex], contact);
    }

    store.commit('Messenger/onContactUpdated', contact);
}

function closeForm() {
    formIsVisible.value = false;
    updatingContact.value = null;
}

function editContact(contact) {
    updatingContact.value = contact;
    formIsVisible.value = true;
}

function addContact() {
    formIsVisible.value = true;
}

// preview contact

const viewedContactId = ref(null);
const contactModalIsVisible = ref(false);

function showContact(contactId) {
    viewedContactId.value = contactId;
    contactModalIsVisible.value = true;
}
</script>
