<template>
    <Table shadow fluid class="company-table">
        <template #thead>
            <Tr>
                <Th>#</Th>
                <Th class="text-left" sort="nameRu">название компании</Th>
                <Th>категория</Th>
                <Th>контакт</Th>
                <Th>консультант</Th>
                <Th sort="created_at">обновление</Th>
            </Tr>
        </template>
        <template #tbody>
            <Loader v-if="loader" />
            <CompanyTableItem
                v-for="(company, idx) in companies"
                :key="company.id"
                @deleted-from-folder="$emit('deleted-from-folder', company.id, $event)"
                :company="company"
                :odd="!(idx % 2)"
            />
        </template>
    </Table>
</template>

<script setup>
import CompanyTableItem from '@/components/Company/Table/CompanyTableItem.vue';
import Table from '@/components/common/Table/Table.vue';
import Th from '@/components/common/Table/Th.vue';
import Tr from '@/components/common/Table/Tr.vue';
import Loader from '@/components/common/Loader.vue';

defineEmits(['deleted-from-folder']);
defineProps({
    companies: {
        type: Array,
        default: () => []
    },
    loader: {
        type: Boolean,
        default: false
    }
});
</script>
