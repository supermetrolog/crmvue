<template>
    <table class="table" :class="{ 'table--fluid': fluid }">
        <thead>
            <slot name="thead" />
        </thead>
        <tbody>
            <slot name="tbody" />
        </tbody>
    </table>
</template>

<script>
export default {
    name: 'Table',
    props: {
        fluid: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<style></style>