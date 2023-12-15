<template>
    <div class="chip">
        <span class="chip__content" v-html="html"></span>
        <i @click="$emit('click', value)" class="chip__icon fa-solid fa-xmark" :title="title" />
    </div>
</template>
<script>
export default {
    name: 'Chip',
    props: {
        value: {
            type: [String, Number, Boolean],
            required: true
        },
        title: {
            type: String,
            default: 'Удалить'
        },
        html: {
            type: [String, Number],
            default: ''
        }
    },
    mounted() {}
};
</script>