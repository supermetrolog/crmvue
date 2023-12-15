<template>
    <div class="company-groups-table">
        <div class="row no-gutters">
            <div class="col-12">
                <Table>
                    <template #thead>
                        <Tr class="text-left">
                            <Th> Название</Th>
                            <Th> Описание</Th>
                            <Th></Th>
                        </Tr>
                    </template>
                    <template #tbody>
                        <Tr v-for="item in companyGroups" :key="item.id">
                            <Td> {{ item.full_name }}</Td>
                            <Td class="description">
                                {{ item.description }}
                            </Td>
                            <Td class="text-right">
                                <button @click="$emit('clickEdit', item)" class="btn btn-action text-primary">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </Td>
                        </Tr>
                    </template>
                </Table>
            </div>
        </div>
    </div>
</template>

<script>
import Table from '@/components/common/Table/Table.vue';
import Tr from '@/components/common/Table/Tr.vue';
import Th from '@/components/common/Table/Th.vue';
import Td from '@/components/common/Table/Td.vue';

export default {
    name: 'CompanyGroupsTable',
    components: {
        Table,
        Tr,
        Th,
        Td
    },
    props: {
        companyGroups: {
            type: Array
        }
    }
};
</script>

<style></style>
