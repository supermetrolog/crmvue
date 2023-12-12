<template>
    <button
        class="button"
        :class="{'button--icon': icon, 'button--warning': warning, 'button--small': small, 'button--success': success, 'button--info': info}"
        :title="title"
        @click="$emit('click')"
    >
        <slot/>
    </button>
</template>
<script>
export default {
    name: 'Button',
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
    },
    emits: ['click']
}
</script>