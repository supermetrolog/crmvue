<template>
    <div class="schedule-tooltip schedule-tooltip--calls">
        <span class="schedule-tooltip__icon rounded-icon bg-primary">
            <i class="fa-solid fa-phone"> </i>
        </span>
        <span>{{ title }}</span>
    </div>
</template>
<script>
import plural from 'plural-ru';

export default {
    name: 'DatePickerTooltipCalls',
    props: {
        tooltip: {
            type: Object,
            required: true
        }
    },
    computed: {
        title() {
            return plural(
                this.tooltip?.count,
                'Запланирован %d звонок',
                'Запланировано %d звонка',
                'Запланировано %d звонков'
            );
        }
    }
};
</script>
