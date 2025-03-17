<template>
    <div class="messenger-quiz-header">
        <div class="messenger-quiz-header__heading mb-1">
            <UiField color="light" bordered>{{ label }} ({{ contacts.length }}):</UiField>
            <UiButtonIcon
                @click="$emit('suggest-create')"
                label="Добавить контакт"
                color="light"
                small
                icon="fa-solid fa-user-plus"
            />
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
        <UiButton
            v-if="!contacts.length"
            @click="$emit('show-archived')"
            icon="fa-solid fa-archive"
            color="light"
            small
        >
            Показать архивные ({{ archivedContactsCount ?? 0 }})
        </UiButton>
        <UiModal
            v-model:visible="commentsModalIsOpen"
            :title="`Просмотр комментариев (${comments.length})`"
            :width="600"
        >
            <MessengerQuizContactsComments :comments />
            <template #actions="{ close }">
                <UiButton @click="close" small color="light" icon="fa-solid fa-ban">
                    Закрыть
                </UiButton>
            </template>
        </UiModal>
    </div>
</template>
<script setup>
import { computed, ref, shallowRef, useTemplateRef } from 'vue';
import MessengerQuizContact from '@/components/Messenger/Quiz/MessengerQuizContact.vue';
import { useHorizontalScroll } from '@/composables/useHorizontalScroll.js';
import MessengerQuizContactsComments from '@/components/Messenger/Quiz/MessengerQuizContactsComments.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import UiField from '@/components/common/UI/UiField.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';

const currentContact = defineModel('contact');
const emit = defineEmits(['suggest-create', 'edit', 'selected', 'show-archived']);
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
    grid: Boolean,
    archivedContactsCount: Number
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

const selectedContactsSet = computed(
    () => new Set(props.selectedContacts.map(contact => contact.entity.id))
);
</script>
