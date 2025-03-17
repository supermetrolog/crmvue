<template>
    <div class="messenger-quiz__disabled">
        <UiModal
            show
            custom-close
            :blackout-opacity="0.1"
            :width
            hide-header
            body-class="messenger-quiz__disabled-body"
            title="Предупреждение"
        >
            <div class="d-flex align-items-center justify-content-center gap-3">
                <i class="icon" :class="icon" />
                <div>
                    <p class="fs-3 mb-2 font-weight-semi">{{ title }}</p>
                    <p>
                        <slot name="message">
                            {{ message }}
                        </slot>
                    </p>
                </div>
            </div>
            <template v-if="$slots.actions" #actions>
                <slot name="actions" />
            </template>
        </UiModal>
    </div>
</template>
<script setup>
import UiModal from '@/components/common/UI/UiModal.vue';

defineProps({
    width: Number,
    title: {
        type: String,
        required: true
    },
    message: String,
    icon: {
        type: String,
        required: true
    }
});
</script>
