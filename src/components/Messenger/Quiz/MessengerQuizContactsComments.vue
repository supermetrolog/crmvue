<template>
    <div class="messenger-quiz-header-comments">
        <DashboardChip class="dashboard-bg-warning-l mb-3 w-100 text-center">
            <i class="fa-solid fa-exclamation-triangle mr-2" />
            <span>Раздел в разработке. Сейчас доступен в режиме просмотра.</span>
        </DashboardChip>
        <div v-if="comments.length" class="messenger-quiz-header-comments__list">
            <MessengerQuizContactsCommentsItem
                v-for="comment in comments"
                :key="comment.id"
                :comment="comment"
            />
        </div>
        <EmptyData v-else>Список комментариев пуст..</EmptyData>
    </div>
</template>
<script setup>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import MessengerQuizContactsCommentsItem from '@/components/Messenger/Quiz/MessengerQuizContactsCommentsItem.vue';

defineProps({
    comments: {
        type: Array,
        required: true
    }
});
</script>
