<template>
    <div>
        <div v-if="files?.length" class="company-preview__documents">
            <File
                v-for="file in files"
                :key="file.id"
                :file="file"
                class="company-preview__document"
                read-only
            />
            {{ files }}
        </div>
        <EmptyLabel v-else class="mx-auto">Список файлов пуст...</EmptyLabel>
    </div>
</template>

<script setup>
import File from '@/components/common/Forms/File.vue';
import EmptyLabel from '@/components/common/EmptyLabel.vue';

defineProps({
    files: {
        type: Array,
        default: () => []
    }
});
</script>
