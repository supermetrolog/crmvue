<template>
    <CompanyBoxLayout>
        <template #header>
            <span>ОБЪЕКТЫ ({{ objects.length }}), АРЕНДАТОРЫ ({{ rentersCount }})</span>
        </template>
        <template #content>
            <CompanyBoxObjectsList
                v-if="objects.length"
                @load="$emit('load', $event)"
                :objects="objects"
            />
            <div v-else class="company-box-empty">
                <EmptyData class="company-box-empty__data"> Нет данных </EmptyData>
            </div>
        </template>
    </CompanyBoxLayout>
</template>

<script>
import CompanyBoxObjectsList from './CompanyBoxObjectsList.vue';
import CompanyBoxLayout from '@/components/Company/Box/CompanyBoxLayout.vue';
import EmptyData from '@/components/common/EmptyData.vue';

export default {
    name: 'CompanyBoxObjects',
    components: { EmptyData, CompanyBoxLayout, CompanyBoxObjectsList },
    emits: ['load'],
    props: {
        objects: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        rentersCount() {
            return this.objects.reduce((acc, object) => acc + object.deals?.length, 0);
        }
    }
};
</script>
