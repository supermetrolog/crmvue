<template>
    <button v-tippy="label" class="hover-actions__button" :class="{ active: active }">
        <slot></slot>
    </button>
</template>
<script>
export default {
    name: 'HoverActionsButton',
    props: {
        label: {
            type: String,
            default: null
        },
        active: {
            type: Boolean,
            default: false
        }
    }
};
</script>
