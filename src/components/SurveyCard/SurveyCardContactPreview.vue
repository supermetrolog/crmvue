<template>
    <div>
        <Spinner v-if="isLoading" label="Загрузка контакта" class="absolute-center" />
        <CompanyContactItem
            v-else-if="contact"
            @create-comment="createComment"
            @comment-deleted="onCommentDeleted"
            @comment-updated="onCommentUpdated"
            :contact="contact"
            read-only
        />
        <Loader v-if="isCommentCreating" small />
    </div>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue';
import api from '@/api/api.js';
import Spinner from '@/components/common/Spinner.vue';
import CompanyContactItem from '@/components/Company/Contact/CompanyContactItem.vue';
import Loader from '@/components/common/Loader.vue';
import { spliceById } from '@/utils/helpers/array/spliceById.js';

defineEmits(['hide', 'edit']);
const props = defineProps({
    contactId: {
        type: Number,
        required: true
    }
});

const isLoading = ref(true);

const contact = ref(null);

async function fetchContact() {
    isLoading.value = true;

    try {
        contact.value = await api.contacts.get(props.contactId);
    } finally {
        isLoading.value = false;
    }
}

onMounted(fetchContact);

watch(() => props.contactId, fetchContact);

const isCommentCreating = ref(false);

async function createComment(payload) {
    isCommentCreating.value = true;

    try {
        const comment = await api.contacts.createComment(payload);
        if (comment) {
            contact.value.comments.push(comment);
        }
    } finally {
        isCommentCreating.value = false;
    }
}

function onCommentDeleted(commentId) {
    spliceById(contact.value.comments, commentId);
}

function onCommentUpdated(comment) {
    const commentIndex = contact.value.comments.findIndex(element => element.id === comment.id);
    if (commentIndex !== -1) Object.assign(contact.value.comments[commentIndex], comment);
}
</script>
