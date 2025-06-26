<template>
    <div class="survey-form-stepper-summary__card">
        <p class="survey-form-stepper-summary__name">
            <span>{{ name }}</span>
            <i class="fa-solid ml-auto" :class="progressIcon" />
        </p>
        <div
            class="survey-form-stepper-summary__rect"
            :class="{
                disabled: isDisabled,
                danger: isDanger,
                success: isSuccess,
                warning: isWarning
            }"
        >
            {{ current }} из {{ total }}
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';

interface Props {
    total?: number;
    current: number;
    name: string;
    successCount?: number;
}

const props = withDefaults(defineProps<Props>(), { total: 0, current: 0 });

const isSuccess = computed(() => {
    if (isNotNullish(props.successCount)) {
        return props.current >= props.successCount;
    }

    return props.current === props.total;
});

const isDanger = computed(() => {
    return props.current === 0 && props.total > 0;
});

const isDisabled = computed(() => props.total === 0);

const isWarning = computed(() => {
    if (props.current === 0) return false;

    if (isNotNullish(props.successCount)) {
        return props.current < props.successCount;
    }

    return props.current < props.total;
});

const progressIcon = computed(() => {
    if (isDisabled.value) return 'fa-face-smile text-grey';
    if (isDanger.value) return 'fa-face-frown text-danger';
    if (isSuccess.value) return 'fa-face-smile text-success';
    return 'fa-face-meh text-warning';
});
</script>
