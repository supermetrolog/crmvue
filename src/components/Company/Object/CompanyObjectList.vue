<template>
    <div class="company-objects-list row no-gutters">
        <CompanyObjectItem v-for="object of objects" :key="object.id" class="mb-2" :object="object" />
    </div>
</template>

<script>
import CompanyObjectItem from './CompanyObjectItem.vue';

export default {
    name: 'CompanyObjectsList',
    components: {
        CompanyObjectItem
    },
    props: {
        objects: {
            type: Array
        }
    }
};
</script>

<style></style>
