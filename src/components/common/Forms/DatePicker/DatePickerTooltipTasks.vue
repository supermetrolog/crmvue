<template>
    <div class="schedule-tooltip schedule-tooltip--tasks">
        <span class="schedule-tooltip__icon rounded-icon bg-black">
            <i class="fa-solid fa-bolt"></i>
        </span>
        <span>Истекает {{ title }}</span>
    </div>
</template>
<script>
import plural from 'plural-ru';

export default {
    name: 'DatePickerTooltipTasks',
    props: {
        tooltip: {
            type: Object,
            required: true
        }
    },
    computed: {
        title() {
            return plural(this.tooltip.count, '%d задача', '%d задачи', '%d задач');
        }
    }
};
</script>
