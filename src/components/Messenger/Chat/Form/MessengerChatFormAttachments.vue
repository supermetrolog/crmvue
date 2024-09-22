<template>
    <div class="messenger-chat-form-attachments">
        <File
            v-for="(file, id) in files"
            :key="id"
            @delete="$emit('delete', id)"
            :file="file"
            class="messenger-chat-form-attachments__file"
        />
    </div>
</template>
<script setup>
import File from '@/components/common/Forms/File.vue';

defineEmits(['delete']);
defineProps({
    files: {
        type: Array,
        required: true
    }
});
</script>
