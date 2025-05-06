<template>
    <tr class="table-request-row">
        <td></td>
        <td colspan="4">
            <CompanyTableTimeline
                v-for="timeline in timelines"
                :key="timeline.id"
                @click="$emit('open-timeline')"
                :timeline="timeline"
                class="company-table-item__timeline"
                :request-name="requestName"
            />
        </td>
        <td>
            <div class="d-flex justify-content-center">
                <TableDateBlock :date="date" label="Дата обновления" />
            </div>
        </td>
    </tr>
</template>

<script setup>
import CompanyTableTimeline from '@/components/Company/Table/CompanyTableTimeline.vue';
import TableDateBlock from '@/components/common/Table/TableDateBlock.vue';

defineProps({
    timelines: {
        type: Array,
        required: true
    },
    requestName: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    attention: Boolean
});

defineEmits(['open-timeline']);
</script>
