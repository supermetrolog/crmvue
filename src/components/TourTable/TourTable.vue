<template>
    <Table shadow fluid class="survey-table">
        <template #thead>
            <Tr>
                <Th>#</Th>
                <Th>TourId</Th>
                <Th>Viewed</Th>
                <Th>Total</Th>
                <Th sort="user_id">User</Th>
                <Th>Date</Th>
            </Tr>
        </template>
        <template #tbody>
            <Loader v-if="loading" />
            <TourTableItem
                v-for="tour in tours"
                :key="tour.id"
                @reset="$emit('reset', tour)"
                :tour="tour"
            />
        </template>
    </Table>
</template>

<script setup>
import Table from '@/components/common/Table/Table.vue';
import Th from '@/components/common/Table/Th.vue';
import Tr from '@/components/common/Table/Tr.vue';
import Loader from '@/components/common/Loader.vue';
import TourTableItem from '@/components/TourTable/TourTableItem.vue';

defineEmits(['reset']);
defineProps({
    tours: {
        type: Array,
        default: () => []
    },
    loading: Boolean
});
</script>
