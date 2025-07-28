<template>
    <div>
        <UiClamped @expanded="$emit('expanded')" @hidden="$emit('hidden')" button-class="fs-2">
            <div>
                <i class="fs-2 mr-1">{{ updatedAt }}. {{ authorLabel }}.</i>
                <div ref="comment" class="company-table-item-summary-survey__comment"></div>
            </div>
        </UiClamped>
        <UiButton
            v-if="total > 1"
            @click="$emit('show-all')"
            mini
            class="mt-1 py-0"
            color="transparent"
        >
            {{ totalLabel }}
        </UiButton>
    </div>
</template>

<script setup>
import { computed, useTemplateRef } from 'vue';
import { useLinkify } from '@/composables/useLinkify.js';
import UiClamped from '@/components/common/UiClamped.vue';
import { toDateFormat } from '@/utils/formatters/date';
import { useAuth } from '@/composables/useAuth.js';
import { UserRoleEnum } from '@/types/user';
import UiButton from '@/components/common/UI/UiButton.vue';
import { plural } from '@/utils/plural.js';

defineEmits(['expanded', 'hidden', 'show-all']);
const props = defineProps({
    message: {
        type: Object,
        required: true
    },
    editMode: Boolean,
    total: {
        type: Number,
        default: 0
    }
});

const totalLabel = computed(() =>
    plural(props.total - 1, '+ еще %d комментарий', '+ еще %d комментария', '+ еще %d комментариев')
);

const updatedAt = computed(() => {
    return toDateFormat(props.message.updated_at, 'D.MM.YY');
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
</script>
