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
<script>
import File from '@/components/common/Forms/File.vue';

export default {
    name: 'MessengerChatFormAttachments',
    components: { File },
    emits: ['delete'],
    props: {
        files: {
            type: Array,
            required: true
        }
    }
};
</script>
