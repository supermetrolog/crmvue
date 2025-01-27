<template>
    <div class="messenger-quiz-header">
        <div class="messenger-quiz-header__heading mb-1">
            <DashboardChip class="dashboard-bg-gray-l">
                {{ label }} ({{ contacts.length }}):
            </DashboardChip>
            <HoverActionsButton
                @click="$emit('suggest-create')"
                label="Добавить контакт"
                class="dashboard-bg-gray-l"
                small
            >
                <i class="fa-solid fa-user-plus"></i>
            </HoverActionsButton>
        </div>
        <div
            ref="contactsListEl"
            @wheel.prevent
            :class="{
                'messenger-quiz-header__grid': grid,
                'messenger-quiz-header__list': !grid
            }"
        >
            <MessengerQuizContact
                v-for="contact in contacts"
                :key="contact.id"
                @show-comments="showComments(contact)"
                @edit="$emit('edit', contact)"
                @click="selectCurrentContact(contact)"
                :contact="contact"
                :active="currentContact?.id === contact.id"
                :disabled="selectedContactsSet.has(contact.id) && currentContact?.id !== contact.id"
                class="messenger-quiz-header__contact"
            />
        </div>
        <Button v-if="!contacts.length" icon small disabled>
            <i class="fa-solid fa-archive" />
            <span>Показать архивные (в разработке)</span>
        </Button>
        <Modal
            @close="closeCommentsModal"
            :title="`Просмотр комментариев (${comments.length})`"
            :width="600"
            :show="commentsModalIsOpen"
        >
            <MessengerQuizContactsComments @close="closeCommentsModal" :comments />
        </Modal>
    </div>
</template>
<script setup>
import { computed, ref, shallowRef, useTemplateRef } from 'vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import Modal from '@/components/common/Modal.vue';
import MessengerQuizContact from '@/components/Messenger/Quiz/MessengerQuizContact.vue';
import { useHorizontalScroll } from '@/composables/useHorizontalScroll.js';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import MessengerQuizContactsComments from '@/components/Messenger/Quiz/MessengerQuizContactsComments.vue';
import Button from '@/components/common/Button.vue';

const currentContact = defineModel('contact');
const emit = defineEmits(['suggest-create', 'edit', 'selected']);
const props = defineProps({
    contacts: {
        type: Array,
        required: true
    },
    selectedContacts: {
        type: Array,
        default: () => []
    },
    label: {
        type: String,
        default: 'Список контактов'
    },
    grid: Boolean
});

const contactsListEl = useTemplateRef('contactsListEl');

if (!props.grid) {
    useHorizontalScroll(contactsListEl);
}

function selectCurrentContact(contact) {
    currentContact.value = contact;
    emit('selected', contact);
}

// COMMENTS

const commentsModalIsOpen = ref(false);
const comments = shallowRef([]);

function showComments(contact) {
    comments.value = contact.comments;
    commentsModalIsOpen.value = true;
}

function closeCommentsModal() {
    commentsModalIsOpen.value = false;
}

const selectedContactsSet = computed(
    () => new Set(props.selectedContacts.map(contact => contact.entity.id))
);
</script>
