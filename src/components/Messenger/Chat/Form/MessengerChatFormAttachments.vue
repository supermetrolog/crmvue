<template>
    <div class="messenger-chat-form-attachments" :class="{ error: hasError }">
        <DashboardChip
            v-if="hasError"
            class="dashboard-bg-danger-l mb-1 mw-100 animate__animated animate__flash"
        >
            <i class="fa-solid fa-file-circle-exclamation mr-1" />
            <span>
                Превышен лимит файлов в одном сообщении: не больше 20 файлов. Загружено:
                {{ files.length + loadings.length }}.
            </span>
        </DashboardChip>
        <div class="messenger-chat-form-attachments__list">
            <File
                v-for="(file, id) in files"
                :key="id"
                v-tippy="
                    file.size >= MAX_FILE_SIZE
                        ? `Файл превышает рекомендуемый размер - ${MAX_FILE_SIZE_HUMANIZE}`
                        : null
                "
                @delete="$emit('delete', id)"
                :file="file"
                class="messenger-chat-form-attachments__file"
                :class="{ error: file.size >= MAX_FILE_SIZE }"
            />
            <div
                v-for="loadingFile in loadings"
                :key="loadingFile.id"
                class="file messenger-chat-form-attachments__file"
            >
                <div class="file__body file__body--loading">
                    <Progress :percent="loadingFile.progress" title="загрузки" :height="8" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import File from '@/components/common/Forms/File.vue';
import { MAX_FILE_SIZE, MAX_FILE_SIZE_HUMANIZE, MAX_FILES_COUNT } from '@/const/messenger.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { computed } from 'vue';
import Progress from '@/components/common/Progress.vue';

defineEmits(['delete']);
const props = defineProps({
    files: {
        type: Array,
        required: true
    },
    loadings: {
        type: Array,
        default: () => []
    },
    max: {
        type: Number,
        default: MAX_FILES_COUNT
    }
});

const hasError = computed(() => props.files.length + props.loadings.length > props.max);
</script>
