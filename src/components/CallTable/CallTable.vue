<template>
    <Table shadow fluid class="call-table">
        <template #thead>
            <Tr>
                <Th>#</Th>
                <Th sort="type">Тип звонка</Th>
                <Th sort="status">Статус</Th>
                <Th sort="contact_name">Клиент</Th>
                <Th>Телефон</Th>
                <Th sort="contact_position">Должность</Th>
                <Th sort="user_name">Сотрудник</Th>
                <Th sort="created_at">Дата фиксации</Th>
            </Tr>
        </template>
        <template #tbody>
            <Loader v-if="loading" />
            <CallTableItem
                v-for="(call, idx) in calls"
                :key="call.id"
                @open-phone="$emit('open-phone', call.contact)"
                :call="call"
                :class="{ odd: idx % 2 }"
            />
        </template>
    </Table>
</template>

<script setup>
import Table from '@/components/common/Table/Table.vue';
import Th from '@/components/common/Table/Th.vue';
import Tr from '@/components/common/Table/Tr.vue';
import Loader from '@/components/common/Loader.vue';
import CallTableItem from '@/components/CallTable/CallTableItem.vue';

defineEmits(['open-phone']);
defineProps({
    calls: {
        type: Array,
        default: () => []
    },
    loading: Boolean
});
</script>
