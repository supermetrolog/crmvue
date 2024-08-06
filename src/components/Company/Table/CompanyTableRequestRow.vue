<template>
    <tr class="table-request-row">
        <td></td>
        <td colspan="5">
            <CompanyTableTimeline
                v-for="timeline in timelines"
                :key="timeline.id"
                @click="openTimeline"
                class="company-table-item__timeline"
                :current-steps="timeline.timelineSteps"
                :request-name="requestName"
            />
        </td>
        <td class="text-warning">
            <div class="d-flex justify-content-center align-items-center">
                <span v-if="attention">Уделите внимание запросу!</span>
            </div>
        </td>
        <td>
            <div class="d-flex justify-content-center">
                <TableDateBlock :date="date" label="Обновление" />
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
    attention: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['open-timeline']);

const openTimeline = () => emit('open-timeline');
</script>
