<template>
    <MessengerDialogPreviewLabel
        v-tippy="
            editable
                ? { content: 'Нажмите, чтобы редактировать [в разработке]', placement: 'right' }
                : null
        "
        @click="onClickLabel"
        :class="[labelClass, { editable: editable }]"
    >
        <slot name="label">
            {{ label }}
        </slot>
    </MessengerDialogPreviewLabel>
    <MessengerDialogPreviewValue>
        <slot />
        <template v-if="$slots.warning" #warning>
            <slot name="warning"></slot>
        </template>
    </MessengerDialogPreviewValue>
</template>
<script setup>
import MessengerDialogPreviewLabel from '@/components/Messenger/Dialog/Preview/MessengerDialogPreviewLabel.vue';
import MessengerDialogPreviewValue from '@/components/Messenger/Dialog/Preview/MessengerDialogPreviewValue.vue';

const emit = defineEmits(['edit']);
const props = defineProps({
    label: {
        type: String,
        default: null
    },
    labelClass: {
        type: [String, Array, Object],
        default: null
    },
    editable: {
        type: Boolean,
        default: false
    }
});

const onClickLabel = () => {
    if (props.editable) emit('edit');
};
</script>
