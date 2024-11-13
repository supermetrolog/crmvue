<template>
    <button
        v-tippy="{
            content: active
                ? 'Нажмите, чтобы скрыть предложения снизу.'
                : `${label}. Нажмите, чтобы просмотреть их.`,
            hideOnClick: false
        }"
        @click="$emit('open', type)"
        class="offer-table-item__relation-button"
        :class="{ active: active }"
    >
        <i class="fa-solid fa-caret-up"></i>
        <span>
            <slot />
        </span>
        <i
            class="offer-table-item__relation-icon fa-solid"
            :class="[active ? 'fa-eye-slash' : 'fa-eye']"
        />
    </button>
</template>

<script setup>
defineEmits(['open']);
defineProps({
    active: {
        type: Boolean,
        default: false
    },
    type: {
        type: Number,
        required: true
    },
    label: {
        type: String,
        required: true
    }
});
</script>
