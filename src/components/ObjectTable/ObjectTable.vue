<template>
    <Table fluid shadow class="offer-table">
        <template #thead>
            <Tr>
                <Th>#</Th>
                <Th>Объект</Th>
                <Th>Адрес</Th>
                <Th :sort="sortable ? 'from_mkad' : null">мкад</Th>
                <Th :sort="sortable ? 'area' : null">площадь</Th>
                <Th>Собственник</Th>
                <Th :sort="sortable ? 'last_update' : null">обновление</Th>
            </Tr>
        </template>
        <template #tbody>
            <Loader v-if="loader && objects.length" />
            <Spinner v-else-if="loader" center />
            <ObjectTableItem
                v-for="object in objects"
                :key="object.id"
                :object="object"
                :loader="loader"
            />
        </template>
    </Table>
</template>

<script setup>
import Table from '@/components/common/Table/Table.vue';
import Tr from '@/components/common/Table/Tr.vue';
import Th from '@/components/common/Table/Th.vue';
import Loader from '@/components/common/Loader.vue';
import ObjectTableItem from '@/components/ObjectTable/ObjectTableItem.vue';
import Spinner from '@/components/common/Spinner.vue';

defineEmits(['show-complex-objects']);
defineProps({
    objects: {
        type: Array,
        required: true
    },
    loader: Boolean,
    sortable: {
        type: Boolean,
        default: true
    }
});
</script>
