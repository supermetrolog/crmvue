<template>
    <div class="company-table-item-summary-survey__pinned-message">
        <div class="company-table-item-summary-survey__pinned-message-header">
            <span>Закрепленное сообщение из чата.</span>
            <span class="ml-1">{{ authorLabel }}, {{ updatedAt }}</span>
            <UiButtonIcon
                @click="$emit('unpin')"
                mini
                icon="fa-solid fa-xmark"
                label="Открепить"
                class="ml-auto"
            />
        </div>
        <div class="company-table-item-summary-survey__pinned-message-content">
            <UiClamped button-class="fs-2">
                <div>
                    <div ref="comment" class="company-table-item-summary-survey__comment"></div>
                </div>
            </UiClamped>
            <div v-if="message.files.length" class="row">
                <File
                    v-for="file in message.files"
                    :key="file.id"
                    @preview="openPreview(file.id)"
                    :file="file"
                    custom-preview
                    read-only
                    class="col-xl-2 col-3"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, useTemplateRef } from 'vue';
import { useLinkify } from '@/composables/useLinkify.js';
import UiClamped from '@/components/common/UiClamped.vue';
import { toDateFormat } from '@/utils/formatters/date';
import { useAuth } from '@/composables/useAuth';
import { UserRoleEnum } from '@/types/user';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import File from '@/components/common/Forms/File.vue';
import { usePreviewer } from '@/composables/usePreviewer.js';

defineEmits(['unpin']);
const props = defineProps({
    message: {
        type: Object,
        required: true
    }
});

const updatedAt = computed(() => {
    return toDateFormat(props.message.updated_at, 'D.MM.YY, HH:mm');
});

const { currentUserId } = useAuth();

const authorLabel = computed(() => {
    if (props.message.from.model.id === currentUserId.value) {
        return 'Вы';
    }

    if (props.message.from.model.role === UserRoleEnum.SYSTEM) {
        return 'Система';
    }

    return props.message.from.model.userProfile.short_name;
});

useLinkify(
    computed(() => props.message.message),
    useTemplateRef('comment')
);

const { preview } = usePreviewer();

const openPreview = id => {
    preview(props.message.files, id);
};
</script>
