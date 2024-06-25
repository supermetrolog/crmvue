<template>
    <div class="CompanyBoxObjectsList">
        <CompanyBoxObjectsListItem v-for="object of objects" :key="object.id" :object="object" />
        <InfiniteLoading v-if="objects.length" @infinite="loadObjects">
            <template #complete><span></span></template>
        </InfiniteLoading>
    </div>
</template>

<script>
import CompanyBoxObjectsListItem from '@/components/Company/Box/CompanyBoxObjectsListItem.vue';
import InfiniteLoading from 'v3-infinite-loading';

export default {
    name: 'CompanyBoxObjectsList',
    components: { InfiniteLoading, CompanyBoxObjectsListItem },
    props: {
        objects: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        loadObjects($state) {
            $state.complete();
        }
    }
};
</script>
