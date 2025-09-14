<template>
    <UiModal v-model:visible="visible" title="Просмотр задачи" :blackout-opacity="0.5" :z-index>
        <template #container="{ close }">
            <TaskPreviewContent
                @updated="$emit('updated', $event)"
                @close="close"
                :task-id
                :active-comment-id
            />
        </template>
    </UiModal>
</template>
<script setup>
import UiModal from '@/components/common/UI/UiModal.vue';
import TaskPreviewContent from '@/components/TaskPreview/TaskPreviewContent.vue';

defineEmits(['updated']);

const visible = defineModel('visible');

defineProps({
    taskId: Number,
    zIndex: Number,
    activeCommentId: Number
});
</script>
