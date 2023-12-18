<template>
    <div class="CompanyBoxObjectsList">
        <CompanyBoxObjectsListItem v-for="object of objects" :key="object.id" :object="object" />
    </div>
</template>

<script>
import CompanyBoxObjectsListItem from '@/components/Company/Box/CompanyBoxObjectsListItem.vue';

export default {
    name: 'CompanyBoxObjectsList',
    components: { CompanyBoxObjectsListItem },
    props: {
        objects: {
            type: Array,
            default: () => []
        }
    }
};
</script>