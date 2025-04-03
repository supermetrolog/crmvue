<template>
    <div class="messenger-quiz-header-comments">
        <Loader v-if="isLoading" small />
        <CompanyContactItemComments
            @create="createComment"
            @deleted="$emit('deleted', $event)"
            @updated="$emit('updated', $event)"
            :comments="comments"
        />
    </div>
</template>
<script setup>
import CompanyContactItemComments from '@/components/Company/Contact/CompanyContactItemComments.vue';
import api from '@/api/api.js';
import { ref } from 'vue';
import Loader from '@/components/common/Loader.vue';

const emit = defineEmits(['created', 'deleted', 'updated']);
const props = defineProps({
    comments: {
        type: Array,
        required: true
    },
    contact: {
        type: Object,
        required: true
    }
});

const isLoading = ref(false);

async function createComment(comment) {
    isLoading.value = true;

    try {
        const createdComment = await api.contacts.createComment({
            contact_id: props.contact.id,
            comment
        });
        if (createdComment) emit('created', createdComment);
    } finally {
        isLoading.value = false;
    }
}
</script>
