<template>
    <div class="company-groups-table">
        <Loader v-if="isLoading" />
        <div class="row no-gutters">
            <div class="col-12">
                <Table shadow>
                    <template #thead>
                        <Tr class="text-left">
                            <Th>Название</Th>
                            <Th>Описание</Th>
                            <Th>Действия</Th>
                        </Tr>
                    </template>
                    <template #tbody>
                        <Tr v-for="item in companyGroups" :key="item.id">
                            <Td> {{ item.nameRu ?? item.nameEng }}</Td>
                            <Td class="description">
                                {{ item.description }}
                            </Td>
                            <Td width="150">
                                <div class="d-flex align-items-center justify-content-center gap-2">
                                    <UiButtonIcon
                                        @click="emit('edit', item)"
                                        label="Редактировать"
                                        icon="fa-solid fa-edit"
                                    />
                                    <UiButtonIcon
                                        @click="deleteGroup(item.id)"
                                        label="Удалить"
                                        icon="fa-solid fa-trash"
                                    />
                                </div>
                            </Td>
                        </Tr>
                    </template>
                </Table>
            </div>
        </div>
    </div>
</template>

<script setup>
import Table from '@/components/common/Table/Table.vue';
import Tr from '@/components/common/Table/Tr.vue';
import Th from '@/components/common/Table/Th.vue';
import Td from '@/components/common/Table/Td.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import { useStore } from 'vuex';
import { shallowRef } from 'vue';
import Loader from '@/components/common/Loader.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';

const emit = defineEmits(['edit', 'deleted']);
defineProps({ companyGroups: { type: Array, default: () => [] } });

const store = useStore();
const { confirm } = useConfirm();
const isLoading = shallowRef(false);

const deleteGroup = async groupID => {
    const confirmed = await confirm(
        'Удалить группу компаний',
        'Вы действительно хотите безвозвратно удалить группу?'
    );
    if (!confirmed) return;

    isLoading.value = true;
    const deleted = await store.dispatch('DELETE_COMPANY_GROUP', groupID);
    if (deleted) emit('deleted');
    isLoading.value = false;
};
</script>
