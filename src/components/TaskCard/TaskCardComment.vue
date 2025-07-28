<template>
    <div class="task-card-comment">
        <Avatar :src="comment.created_by.userProfile.avatar" :size="30" />
        <div class="task-card-comment__content">
            <div class="task-card-comment__header">
                <span class="task-card-comment__username">
                    {{ comment.created_by.userProfile.medium_name }}
                </span>
                <span class="task-card-comment__dot mx-1">·</span>
                <span class="task-card-comment__date">{{ createdAt }}</span>
                <template v-if="editable">
                    <template v-if="canBeEdited">
                        <span class="task-card-comment__dot mx-1">·</span>
                        <TaskCardButton @click="$emit('edit')" class="task-card-comment__button">
                            <span>Изменить</span>
                            <i class="ml-1 fa-solid fa-pen"></i>
                        </TaskCardButton>
                    </template>
                    <template v-if="canBeDeleted">
                        <span class="task-card-comment__dot mx-1">·</span>
                        <TaskCardButton @click="$emit('delete')" class="task-card-comment__button">
                            <span>Удалить</span>
                            <i class="ml-1 fa-solid fa-trash"></i>
                        </TaskCardButton>
                    </template>
                </template>
            </div>
            <div ref="messageElement" class="task-card-comment__message"></div>
            <div v-if="comment.files?.length" class="task-card-comment__files mt-1">
                <File
                    v-for="file in comment.files"
                    :key="file.id"
                    @preview="$emit('preview', file.id)"
                    :file="file"
                    custom-preview
                    read-only
                    class="task-card-comment__file"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, toRef, useTemplateRef } from 'vue';
import { toBeautifulDateFormat } from '@/utils/formatters/date';
import Avatar from '@/components/common/Avatar.vue';
import TaskCardButton from '@/components/TaskCard/TaskCardButton.vue';
import { useAuth } from '@/composables/useAuth.js';
import File from '@/components/common/Forms/File.vue';
import { useLinkify } from '@/composables/useLinkify.js';
import { TaskComment } from '@/types/task';

defineEmits<{
    (e: 'edit'): void;
    (e: 'delete'): void;
    (e: 'preview', id: number): void;
}>();

interface Props {
    comment: TaskComment;
    editable?: boolean;
}

const props = defineProps<Props>();

const { currentUserIsAdmin, currentUserId, currentUserIsModeratorOrHigher } = useAuth();

const createdAt = computed(() => toBeautifulDateFormat(props.comment.created_at));

const canBeEdited = computed(
    () => currentUserIsAdmin.value || props.comment.created_by_id === currentUserId.value
);

const canBeDeleted = computed(
    () =>
        currentUserIsModeratorOrHigher.value || props.comment.created_by_id === currentUserId.value
);

// linkify

const messageElement = useTemplateRef('messageElement');

useLinkify(toRef(props.comment, 'message'), messageElement);
</script>
