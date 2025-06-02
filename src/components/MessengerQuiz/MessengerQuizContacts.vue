template>
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
        <div v-if="!contacts.length" class="d-flex gap-2">
            <UiButton
                @click="$emit('show-archived')"
                icon="fa-solid fa-archive"
                color="light"
                small
                bolder
            >
                Показать архивные ({{ archivedContactsCount ?? 0 }})
            </UiButton>
            <UiButton
                @click="$emit('suggest-create')"
                icon="fa-solid fa-user-plus"
                color="light"
                small
                bolder
            >
                Добавить контакт
            </UiButton>
        </div>
        <UiModal
            v-model:visible="commentsModalIsOpen"
            :title="`Просмотр комментариев (${comments.length})`"
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
    </div>
</template>
<script setup>
import { computed, ref, shallowRef, useTemplateRef } from 'vue';
import MessengerQuizContact from '@/components/MessengerQuiz/MessengerQuizContact.vue';
import { useHorizontalScroll } from '@/composables/useHorizontalScroll.js';
import MessengerQuizContactsComments from '@/components/MessengerQuiz/MessengerQuizContactsComments.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import UiField from '@/components/common/UI/UiField.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { spliceById } from '@/utils/helpers/array/spliceById.js';

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
const viewedCommentsContact = shallowRef(null);
const comments = shallowRef([]);

function showComments(contact) {
    viewedCommentsContact.value = contact;

    comments.value = contact.comments;
    commentsModalIsOpen.value = true;
}

const selectedContactsSet = computed(
    () => new Set(props.selectedContacts.map(contact => contact.entity.id))
);

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
</script>
