<template>
    <div>
        <UiClamped @expanded="$emit('expanded')" @hidden="$emit('hidden')" button-class="fs-2">
            <div ref="comment" class="company-table-item-summary-survey__comment"></div>
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

useLinkify(
    computed(() => props.message.message),
    useTemplateRef('comment')
);
</script>
