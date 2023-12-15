<template>
    <button
        @click="$emit('click')"
        class="button"
        :class="{
            'button--icon': icon,
            'button--warning': warning,
            'button--small': small,
            'button--success': success,
            'button--info': info
        }"
        :title="title"
    >
        <slot />
    </button>
</template>
<script>
export default {
    name: 'Button',
    emits: ['click'],
    props: {
        icon: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        warning: {
            type: Boolean,
            default: false
        },
        small: {
            type: Boolean,
            default: false
        },
        success: {
            type: Boolean,
            default: false
        },
        info: {
            type: Boolean,
            default: false
        }
    }
};
</script>