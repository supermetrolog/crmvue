<template>
    <div class="messenger-chat-message__attachments">
        <div class="messenger-chat-message__photos">
            <File
                v-for="(file, key) in photos"
                :key="key"
                :file="file"
                read-only
                class="messenger-chat-message__photo"
            />
        </div>
        <div class="messenger-chat-message__files mt-2">
            <File
                v-for="(file, key) in docs"
                :key="key"
                :file="file"
                read-only
                class="messenger-chat-message__attachment"
            />
        </div>
    </div>
</template>
<script setup>
import File from '@/components/common/Forms/File.vue';
import { computed } from 'vue';

const props = defineProps({
    files: {
        type: Array,
        required: true
    }
});

const photos = computed(() =>
    props.files.filter(element => element.extension === 'jpg' || element.extension === 'png')
);
const docs = computed(() =>
    props.files.filter(element => element.extension !== 'jpg' && element.extension !== 'png')
);
</script>
