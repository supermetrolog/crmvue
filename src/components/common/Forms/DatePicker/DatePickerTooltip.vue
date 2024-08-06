<template>
    <component :is="tooltipName" :tooltip="tooltip" />
</template>
<script>
import MessengerScheduleTooltipCalls from '@/components/common/Forms/DatePicker/DatePickerTooltipCalls.vue';
import MessengerScheduleTooltipTasks from '@/components/common/Forms/DatePicker/DatePickerTooltipTasks.vue';
export default {
    name: 'DatePickerTooltip',
    components: { MessengerScheduleTooltipCalls, MessengerScheduleTooltipTasks },
    props: {
        tooltip: {
            type: Object,
            required: true
        }
    },
    computed: {
        tooltipName() {
            return 'DatePickerTooltip' + [null, 'Calls', 'Tasks'][this.tooltip.type];
        }
    }
};
</script>
