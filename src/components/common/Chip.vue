<template>
    <div class="chip">
        <span class="chip__content">
            <slot>
                <span v-html="html"></span>
            </slot>
        </span>
        <i
            v-if="value !== null"
            v-tippy="title"
            @click="$emit('delete')"
            class="chip__icon fa-solid fa-close"
            :title="title"
        />
    </div>
</template>
<script setup>
defineEmits(['delete']);
defineProps({
    value: {
        type: [String, Number, Boolean],
        default: null
    },
    title: {
        type: String,
        default: 'Удалить'
    },
    html: {
        type: [String, Number],
        default: ''
    }
});
</script>
