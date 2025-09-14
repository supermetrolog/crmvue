<template>
    <div class="d-flex justify-content-center">
        <TaskCardCommentSkeleton
            v-if="isLoading"
            class="user-notification-card-template__task-comment"
        />
        <TaskCardComment
            v-else-if="comment"
            class="user-notification-card-template__task-comment"
            :comment
        />
    </div>
</template>

<script setup lang="ts">
import { UserNotification } from '@/types/user-notification/user-notification';
import { computed, onBeforeMount, ref, shallowRef } from 'vue';
import api from '@/api/api';
import { TaskComment } from '@/types/task';
import TaskCardComment from '@/components/TaskCard/TaskCardComment.vue';
import TaskCardCommentSkeleton from '@/components/TaskCard/TaskCardCommentSkeleton.vue';

const props = defineProps<{ notification: UserNotification }>();

const commentId = computed(
    () =>
        props.notification.relations.find(relation => relation.entity_type === 'task_comment')
            ?.entity_id
);

const isLoading = ref(false);

const comment = shallowRef<TaskComment | null>(null);

async function fetchComment() {
    isLoading.value = true;

    comment.value = await api.taskComment.get(commentId.value);

    isLoading.value = false;
}

onBeforeMount(() => {
    if (commentId.value) {
        fetchComment();
    }
});
</script>
