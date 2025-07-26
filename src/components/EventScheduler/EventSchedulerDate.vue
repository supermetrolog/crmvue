<template>
    <RadioOptions
        v-model="option"
        :options="presets"
        :rounded="false"
        required
        object-key="label"
        :class="`col-${cols}`"
        :v
        :label
        data-tour-id="scheduler:start"
    />
</template>
<script setup lang="ts">
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import { onBeforeMount, watch } from 'vue';
import dayjs from 'dayjs';
import { isNullish } from '@/utils/helpers/common/isNullish.ts';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';

const date = defineModel<Date | null>('date');
const option = defineModel<number | string>('option');

const { label = 'Дата события', cols = 12 } = defineProps<{
    label?: string;
    cols?: number;
    v?: object;
}>();

function getPreparedStartDate(addCount, addUnit = 'day') {
    return dayjs().add(addCount, addUnit).toDate();
}

let presets = {};

function generateStartPresets() {
    presets = {
        1: {
            label: 'Сегодня',
            value: new Date()
        },
        2: {
            value: getPreparedStartDate(1),
            label: 'Завтра'
        },
        3: {
            value: getPreparedStartDate(2),
            label: 'Послезавтра'
        },
        4: {
            value: getPreparedStartDate(5),
            label: 'Через 5 дней'
        },
        5: {
            value: getPreparedStartDate(7),
            label: 'Через неделю'
        },
        6: {
            value: getPreparedStartDate(1, 'month'),
            label: 'Через месяц'
        },
        7: {
            value: getPreparedStartDate(3, 'month'),
            label: 'Через 3 месяца'
        },
        13: {
            value: getPreparedStartDate(6, 'month'),
            label: 'Через пол года'
        },
        14: {
            value: getPreparedStartDate(12, 'month'),
            label: 'Через год'
        },
        100: {
            value: null,
            icon: 'fa-solid fa-calendar',
            label: 'Выбрать вручную..',
            attrs: {
                tourId: 'scheduler:custom-start'
            }
        }
    };
}

watch(option, value => {
    if (isNullish(value)) {
        date.value = null;
        return;
    }

    const presetDate = presets[value].value;

    if (isNotNullish(presetDate)) {
        date.value = presetDate;
    }
});

onBeforeMount(() => {
    generateStartPresets();
});
</script>
