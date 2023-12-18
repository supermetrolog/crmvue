<template>
    <CompanyBoxLayout class="CompanyBoxObjects" :class="'grid-c'">
        <template #header>
            <div class="CompanyBoxObjects-header">
                <span>ОБЪЕКТЫ ({{ objects.length }}), АРЕНДАТОРЫ ({{ rentersCount }})</span>
            </div>
        </template>
        <template #content>
            <CompanyBoxObjectsList :objects="objects" />
            <NoData v-if="!objects.length" />
        </template>
    </CompanyBoxLayout>
</template>

<script>
import CompanyBoxObjectsList from './CompanyBoxObjectsList.vue';
import CompanyBoxLayout from '@/components/Company/Box/CompanyBoxLayout.vue';
import NoData from '@/components/common/NoData.vue';

export default {
    name: 'CompanyBoxObjects',
    components: { NoData, CompanyBoxLayout, CompanyBoxObjectsList },
    props: {
        objects: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        rentersCount() {
            return this.objects.reduce(function (acc, object) {
                return acc + (object.deals.length ? object.deals.length : 0);
            }, 0);
        }
    }
};
</script>