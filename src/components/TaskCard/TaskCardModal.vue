<template>
    <div class="task-card-modal">
        <Loader v-if="loading" />
        <div class="task-card-modal__header">
            <p class="task-card__label">{{ title }}</p>
            <i
                v-tippy="'Закрыть'"
                @click="$emit('close')"
                class="task-card__close fa-regular fa-xmark-circle"
            />
        </div>
        <slot />
    </div>
</template>

<script setup>
import Loader from '@/components/common/Loader.vue';

defineEmits(['close']);
defineProps({
    loading: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        required: true
    }
});
</script>
