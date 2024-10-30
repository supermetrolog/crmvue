<template>
    <div class="messenger-chat-message__attachments">
        <div class="messenger-chat-message__photos">
            <File
                v-for="file in photos"
                :key="file.id"
                @preview="openPreview(file.id)"
                :file="file"
                custom-preview
                read-only
                class="messenger-chat-message__photo"
            />
        </div>
        <div class="messenger-chat-message__files mt-2">
            <File
                v-for="file in docs"
                :key="file.id"
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
import { usePreviewer } from '@/composables/usePreviewer.js';

const props = defineProps({
    files: {
        type: Array,
        required: true
    }
});

const { preview } = usePreviewer();

const photos = computed(() =>
    props.files.filter(element => element.extension === 'jpg' || element.extension === 'png')
);
const docs = computed(() =>
    props.files.filter(element => element.extension !== 'jpg' && element.extension !== 'png')
);

const openPreview = id => {
    preview(props.files, id);
};
</script>
