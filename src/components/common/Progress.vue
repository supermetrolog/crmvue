<template>
    <div class="progress">
        <div class="progress__bar" :style="{ height: height + 'px' }">
            <div
                class="progress__percent"
                :style="{ width: percent + '%' }"
                :class="percentClass"
            ></div>
        </div>
        <div class="progress__label">
            <p>{{ percent }}% {{ title }}</p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    percent: {
        type: Number
    },
    title: {
        type: String,
        default: 'Заполнения'
    },
    height: {
        type: Number,
        default: 4
    }
});

const percentClass = computed(() => {
    if (props.percent < 30) return 'bg-danger';
    if (props.percent < 60) return 'bg-warning';
    if (props.percent < 90) return 'bg-primary';

    return 'bg-success';
});
</script>
