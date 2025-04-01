<template>
    <div class="messenger-quiz-header-comments">
        <DashboardChip class="dashboard-bg-warning-l mb-3 w-100 text-center">
            <i class="fa-solid fa-exclamation-triangle mr-2" />
            <span>Раздел в разработке. Сейчас доступен в режиме просмотра.</span>
        </DashboardChip>
        <Loader v-if="isLoading" small />
        <CompanyContactItemComments
            v-if="comments.length"
            @create="createComment"
            @deleted="$emit('deleted', $event)"
            @updated="$emit('updated', $event)"
            :comments="comments"
        />
        <EmptyData v-else>Список комментариев пуст..</EmptyData>
    </div>
</template>
<script setup>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import EmptyData from '@/components/common/EmptyData.vue';
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
