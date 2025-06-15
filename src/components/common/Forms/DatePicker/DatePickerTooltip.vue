<template>
    <div class="d-flex flex-column gap-1 schedule-tooltip">
        <p class="font-weight-semi mb-2">{{ callsLabel }}</p>
        <div v-for="call in tooltip.calls" :key="call.id" class="schedule-tooltip__call">
            <span class="schedule-tooltip__icon rounded-icon bg-primary">
                <i class="fa-solid fa-phone"> </i>
            </span>
            <span class="schedule-tooltip__text">{{ call.title }}</span>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { plural } from '@/utils/plural.js';

const props = defineProps({
    tooltip: {
        type: Object,
        required: true
    }
});

const callsLabel = computed(() =>
    plural(
        props.tooltip.calls.length,
        'Запланирован %d звонок',
        'Запланированы %d звонка',
        'Запланировано %d звонков'
    )
);
</script>
