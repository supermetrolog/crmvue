<template>
    <Table shadow fluid class="survey-table">
        <template #thead>
            <Tr>
                <Th>#</Th>
                <Th sort="chat_member_id">Компания</Th>
                <Th sort="contact_id">Контакт</Th>
                <Th>Звонки</Th>
                <Th sort="updated_at">Последнее обновление</Th>
                <Th sort="created_at">Дата создания</Th>
            </Tr>
        </template>
        <template #tbody>
            <Loader v-if="loading" />
            <SurveyDraftTableItem
                v-for="survey in surveys"
                :key="survey.id"
                @continue="$emit('continue-draft', survey)"
                @to-chat="$emit('to-chat', survey)"
                @open-survey="$emit('open-survey', survey)"
                @delete-draft="$emit('delete-draft', survey.id)"
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
import SurveyDraftTableItem from '@/components/SurveyTable/SurveyDraftTableItem.vue';

defineEmits(['to-chat', 'open-survey', 'continue-draft', 'delete-draft']);
defineProps({
    surveys: {
        type: Array,
        default: () => []
    },
    loading: Boolean
});
</script>
