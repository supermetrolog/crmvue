<template>
    <Table shadow fluid class="survey-table">
        <template #thead>
            <Tr>
                <Th>#</Th>
                <Th sort="chat_member_id">Компания</Th>
                <Th sort="contact_id">Контакт</Th>
                <Th>Звонки</Th>
                <Th sort="user_id">Сотрудник</Th>
                <Th>Статус</Th>
                <Th sort="completed_at">Дата создания</Th>
            </Tr>
        </template>
        <template #tbody>
            <Loader v-if="loading" />
            <SurveyTableItem
                v-for="survey in surveys"
                :key="survey.id"
                @to-chat="$emit('to-chat', survey)"
                @open-survey="$emit('open-survey', survey)"
                :survey="survey"
            />
        </template>
    </Table>
</template>

<script setup>
import Table from '@/components/common/Table/Table.vue';
import Th from '@/components/common/Table/Th.vue';
import Tr from '@/components/common/Table/Tr.vue';
import Loader from '@/components/common/Loader.vue';
import SurveyTableItem from '@/components/SurveyTable/SurveyTableItem.vue';

defineEmits(['to-chat', 'open-survey']);
defineProps({
    surveys: {
        type: Array,
        default: () => []
    },
    loading: Boolean
});
</script>
