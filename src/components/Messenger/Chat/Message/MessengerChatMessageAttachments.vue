<template>
    <div class="messenger-chat-message__attachments">
        <File
            v-for="(file, key) in files"
            :key="key"
            :file="file"
            read-only
            class="messenger-chat-message__attachment"
        />
    </div>
</template>
<script>
import File from '@/components/common/Forms/File.vue';

export default {
    name: 'MessengerChatMessageAttachments',
    components: { File },
    props: {
        files: {
            type: Array,
            required: true
        }
    }
};
</script>
