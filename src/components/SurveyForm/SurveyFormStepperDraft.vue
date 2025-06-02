<template>
    <UiField class="text-dark" color="light">
        <span>Черновик #{{ draft.id }} | </span>
        <UiTooltipIcon
            :tooltip="`${draftUpdatedAt} - последнее обновление черновика`"
            icon="fa-solid fa-clock-rotate-left"
        />
        <span>{{ draftUpdateAtFromNow }}</span>
    </UiField>
</template>
<script setup>
import { computed, shallowRef, watch } from 'vue';
import UiField from '@/components/common/UI/UiField.vue';
import { useIntervalFn } from '@vueuse/core';
import { dayjsFromMoscow } from '@/utils/formatters/date.js';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';

const props = defineProps({
    draft: {
        type: Object,
        required: true
    },
    disabled: Boolean
});

// draft

const draftUpdatedAtDayjs = computed(() => dayjsFromMoscow(props.draft.updated_at));

const draftUpdatedAt = computed(() => draftUpdatedAtDayjs.value.format('D.MM.YY, HH:mm:ss'));

const draftUpdateAtFromNow = shallowRef(null);

function updateDraftCreatedAt() {
    draftUpdateAtFromNow.value = draftUpdatedAtDayjs.value.fromNow();
}

const { resume, pause } = useIntervalFn(updateDraftCreatedAt, 15000, { immediateCallback: true });

watch(
    () => props.disabled,
    value => {
        if (value) pause();
        else resume();
    }
);
</script>
