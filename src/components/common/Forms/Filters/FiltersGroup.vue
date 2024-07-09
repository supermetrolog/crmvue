<template>
    <div class="filters-category"></div>
</template>
<script>
export default {
    name: 'FiltersGroup',
    props: {
        category: {
            type: Object,
            required: true
        }
    }
};
</script>
