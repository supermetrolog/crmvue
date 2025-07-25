<template>
    <Table shadow fluid class="survey-table">
        <template #thead>
            <Tr>
                <Th>#</Th>
                <Th>ChatMember</Th>
                <Th>Message</Th>
            </Tr>
        </template>
        <template #tbody>
            <Loader v-if="loading" />
            <AdminChatMemberMessageTableItem
                v-for="message in messages"
                :key="message.id"
                @delete="$emit('delete', message)"
                @pin-to-entity="$emit('pin-to-entity', message)"
                :message="message"
            />
        </template>
    </Table>
</template>

<script setup>
import Table from '@/components/common/Table/Table.vue';
import Th from '@/components/common/Table/Th.vue';
import Tr from '@/components/common/Table/Tr.vue';
import Loader from '@/components/common/Loader.vue';
import AdminChatMemberMessageTableItem from '@/components/Admin/ChatMemberMessage/Table/AdminChatMemberMessageTableItem.vue';

defineEmits(['delete', 'pin-to-entity']);
defineProps({
    messages: {
        type: Array,
        default: () => []
    },
    loading: Boolean
});
</script>
