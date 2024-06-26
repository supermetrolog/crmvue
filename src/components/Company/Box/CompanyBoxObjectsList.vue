<template>
    <div class="company-box-objects-list">
        <CompanyBoxObjectsListItem v-for="object of objects" :key="object.id" :object="object" />
        <InfiniteLoading v-if="objects.length" @infinite="loadObjects">
            <template #spinner>
                <CompanyBoxObjectsListItemSkeleton />
            </template>
            <template #complete><span></span></template>
        </InfiniteLoading>
    </div>
</template>

<script>
import CompanyBoxObjectsListItem from '@/components/Company/Box/CompanyBoxObjectsListItem.vue';
import InfiniteLoading from 'v3-infinite-loading';
import CompanyBoxObjectsListItemSkeleton from '@/components/Company/Box/CompanyBoxObjectsListItemSkeleton.vue';

export default {
    name: 'CompanyBoxObjectsList',
    components: {
        CompanyBoxObjectsListItemSkeleton,
        InfiniteLoading,
        CompanyBoxObjectsListItem
    },
    emits: ['load'],
    props: {
        objects: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        async loadObjects($state) {
            await this.$emit('load', $state);
        }
    }
};
</script>
