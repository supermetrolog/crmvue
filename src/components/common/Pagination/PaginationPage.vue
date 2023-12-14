<template>
    <button
        class="pagination-classic__button"
        :class="{'pagination-classic__button--navigate': navigate, active: active}"
        @click.prevent="$emit('click')"
        :disabled="disabled"
    >
        <slot/>
    </button>
</template>
<script>

export default {
    name: "PaginationPage",
    emits: ['click'],
    props: {
        navigate: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        active: {
            type: Boolean,
            default: false
        }
    }
}
</script>