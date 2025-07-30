<template>
    <div class="survey-form-calls p-2">
        <div>
            <div class="survey-form-object-preview__tabs">
                <SurveyFormObjectsPreviewTab v-model="currenTab" :name="TABS.ACTIVE">
                    <span>Актив ( {{ contacts.length }} )</span>
                </SurveyFormObjectsPreviewTab>
                <span>|</span>
                <SurveyFormObjectsPreviewTab v-model="currenTab" :name="TABS.PASSIVE">
                    <span>Архив ( {{ passiveContacts.length }} )</span>
                </SurveyFormObjectsPreviewTab>
                <template v-if="contacts.length && !disabled">
                    <span>|</span>
                    <span @click="$emit('add-contact')" class="survey-form-objects__link">
                        + Добавить контакт
                    </span>
                </template>
            </div>
        </div>
        <div v-if="currenTab === TABS.ACTIVE">
            <div class="survey-form-calls__list">
                <SurveyFormContact
                    v-for="contact in contacts"
                    :key="contact.id"
                    v-model="form[contact.id]"
                    @show-comments="showComments(contact)"
                    @edit="editContact(contact)"
                    @select="selectCurrentContact(contact)"
                    @schedule-call="createScheduleCallTask(contact)"
                    @schedule-visit="createScheduleVisitTask(contact)"
                    @schedule-event="createScheduleEventTask(contact)"
                    @change="$emit('change')"
                    @close="currentContact = null"
                    :contact="contact"
                    :active="currentContact?.id === contact.id"
                    :most-callable="contact.id === mostCallableContactId"
                    :disabled
                    :company
                    editable
                    full
                />
            </div>
        </div>
        <div v-else-if="currenTab === TABS.PASSIVE">
            <div v-if="passiveContacts.length" class="survey-form-calls__list">
                <SurveyFormPassiveContact
                    v-for="contact in passiveContacts"
                    :key="contact.id"
                    @show-comments="showComments(contact)"
                    @edit="editContact(contact)"
                    @select="selectCurrentContact(contact)"
                    @close="currentContact = null"
                    :contact="contact"
                    :active="currentContact?.id === contact.id"
                />
            </div>
            <EmptyData v-else class="mt-2"> Список архивных контактов пуст..</EmptyData>
        </div>
        <teleport to="body">
            <FormCompanyContact
                v-if="formIsVisible"
                @close="closeForm"
                @created="$emit('contact-created', $event)"
                @updated="onContactUpdated"
                :formdata="updatingContact"
                :company_id="company?.id"
            />
            <UiModal
                v-model:visible="commentsModalIsOpen"
                :title="`Просмотр комментариев (${comments.length})`"
                :width="600"
            >
                <MessengerQuizContactsComments
                    @updated="onUpdatedComment"
                    @deleted="onDeletedComment"
                    @created="onCreatedComment"
                    :contact="viewedCommentsContact"
                    :comments
                />
            </UiModal>
            <CallScheduler
                v-if="scheduleCallModalIsVisible"
                @created="onCreatedScheduledCall"
                @close="closeScheduleCallModal"
                :contact="scheduleCallContact"
                :relations="schedulerRelations"
                :company
                :chat-member-id
            />
            <VisitScheduler
                v-if="scheduleVisitModalIsVisible"
                @created="onCreatedScheduledVisit"
                @close="closeScheduleVisitModal"
                :contact="scheduleVisitContact"
                :relations="schedulerRelations"
                :company
                :chat-member-id
            />
            <EventScheduler
                v-if="scheduleEventModalIsVisible"
                @created="onCreatedScheduledEvent"
                @close="closeScheduleEventModal"
                :contact="scheduleEventContact"
                :relations="schedulerRelations"
                :company
                :chat-member-id
            />
        </teleport>
    </div>
</template>
<script setup>
import { computed, ref, shallowRef, watch } from 'vue';
import SurveyFormContact from '@/components/SurveyForm/SurveyFormContact.vue';
import FormCompanyContact from '@/components/Forms/Company/FormCompanyContact.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import MessengerQuizContactsComments from '@/components/MessengerQuiz/MessengerQuizContactsComments.vue';
import { spliceById } from '@/utils/helpers/array/spliceById.js';
import CallScheduler from '@/components/CallScheduler/CallScheduler.vue';
import VisitScheduler from '@/components/VisitScheduler/VisitScheduler.vue';
import EventScheduler from '@/components/EventScheduler/EventScheduler.vue';
import { createTourStepElementGenerator, useTourStep } from '@/composables/useTour/useTourStep';
import SurveyFormObjectsPreviewTab from '@/components/SurveyForm/ObjectsPreview/SurveyFormObjectsPreviewTab.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import SurveyFormPassiveContact from '@/components/SurveyForm/SurveyFormPassiveContact.vue';

const emit = defineEmits(['contact-created', 'contact-updated', 'change', 'add-contact']);
const props = defineProps({
    company: {
        type: Object,
        required: true
    },
    contacts: {
        type: Array,
        default: () => []
    },
    passiveContacts: {
        type: Array,
        default: () => []
    },
    chatMemberId: {
        type: Number,
        required: true
    },
    surveyId: Number,
    disabled: Boolean
});

// tabs

const TABS = {
    ACTIVE: 'active',
    PASSIVE: 'passive'
};

const currenTab = ref(TABS.ACTIVE);

const mostCallableContactId = computed(() => {
    let currentMaxIndex = 0;

    for (let i = 0; i < props.contacts.length; i++) {
        if (props.contacts[i].calls?.length > props.contacts[currentMaxIndex].calls?.length) {
            currentMaxIndex = i;
        }
    }

    return props.contacts[currentMaxIndex].id;
});

const form = defineModel({ type: Object, default: () => ({}) });

function generateForm() {
    for (const contact of props.contacts) {
        if (!(contact.id in form.value)) {
            form.value[contact.id] = {
                available: null,
                scheduled: null,
                contact_id: contact.id,
                full_name: contact.full_name
            };
        }
    }
}

watch(() => props.contacts.length, generateForm, { immediate: true });

// select

const currentContact = ref(null);

function selectCurrentContact(contact) {
    if (props.disabled) return;

    if (currentContact.value?.id === contact.id) {
        currentContact.value = null;
    } else {
        currentContact.value = contact;
    }
}

// edit

const updatingContact = shallowRef(null);
const formIsVisible = ref(false);

function editContact(contact) {
    updatingContact.value = contact;
    formIsVisible.value = true;
}

function closeForm() {
    formIsVisible.value = false;
    updatingContact.value = null;
}

function onContactUpdated(_, contact) {
    emit('contact-updated', contact);
}

// comments

const viewedCommentsContact = shallowRef(null);
const comments = shallowRef([]);
const commentsModalIsOpen = ref(false);

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

// scheduled calls

const scheduleCallModalIsVisible = ref(false);
const scheduleCallContact = shallowRef(null);

async function createScheduleCallTask(contact) {
    scheduleCallContact.value = contact;
    scheduleCallModalIsVisible.value = true;
}

function closeScheduleCallModal() {
    scheduleCallModalIsVisible.value = false;
    scheduleCallContact.value = null;
}

function onCreatedScheduledCall(_, payload) {
    form.value[scheduleCallContact.value.id].scheduled = payload.start;
}

const schedulerRelations = computed(() => {
    if (props.surveyId) {
        return [{ entity_type: 'survey', entity_id: props.surveyId }];
    }

    return [];
});

// scheduled visits

const scheduleVisitModalIsVisible = ref(false);
const scheduleVisitContact = shallowRef(null);

async function createScheduleVisitTask(contact) {
    scheduleVisitContact.value = contact;
    scheduleVisitModalIsVisible.value = true;
}

function closeScheduleVisitModal() {
    scheduleVisitModalIsVisible.value = false;
    scheduleVisitContact.value = null;
}

function onCreatedScheduledVisit(_, payload) {
    form.value[scheduleVisitContact.value.id].visit = payload.start;
}

// scheduled event

const scheduleEventModalIsVisible = ref(false);
const scheduleEventContact = shallowRef(null);

async function createScheduleEventTask(contact) {
    scheduleEventContact.value = contact;
    scheduleEventModalIsVisible.value = true;
}

function closeScheduleEventModal() {
    scheduleEventModalIsVisible.value = false;
    scheduleEventContact.value = null;
}

function onCreatedScheduledEvent(_, payload) {
    form.value[scheduleEventContact.value.id].event = payload.start;
}

// tour

// tour

const createTourStepElement = createTourStepElementGenerator('survey-form');

useTourStep({
    key: 5,
    element: createTourStepElement('stepper-calls'),
    popover: {
        title: 'Контакт для разговора',
        description:
            'Созвонитесь с представителем компании, чтобы обсудить положение дел. При необходимости, попытайтесь созвониться со всеми контактами компании, пока не установите связь.',
        side: 'bottom',
        align: 'center'
    },
    onHighlighted() {
        selectCurrentContact(props.contacts[0]);
    }
});
</script>
