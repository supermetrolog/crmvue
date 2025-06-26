<template>
    <div class="schedule">
        <p v-if="label" class="form__label mb-1" :class="{ required: required }">{{ label }}</p>
        <VueDatePicker
            ref="datePicker"
            @update:model-value="onInput"
            @update-month-year="onUpdateMonthAndYear"
            @range-start="$emit('range-start', $event)"
            @range-end="$emit('range-end', $event)"
            :model-value="modelValue"
            locale="ru"
            inline
            :markers="markers"
            select-text="Выбрать"
            auto-apply
            month-name-format="long"
            :highlight="{ weekdays: [0, 6] }"
            :style="{ '--dp-cell-size': size }"
            time-picker-inline
            :min-date
            :max-date
            :preset-dates="_presets"
            six-weeks="center"
            :start-date
            :focus-start-date
            :disabled
            :range
        >
            <template v-if="presetsLabel" #presets-label>
                <span class="ui-date-input__presets-label">{{ presetsLabel }}:</span>
            </template>
            <template #calendar-header="{ index, day }">
                <div :class="index === 5 || index === 6 ? 'color-success' : ''">
                    {{ day }}
                </div>
            </template>
            <template #marker-tooltip="{ tooltip }">
                <DatePickerTooltip :tooltip="tooltip" />
            </template>
            <template #action-preview>
                <AnimationTransition>
                    <div v-if="modelValue" class="schedule-sidebar__body">
                        <div class="schedule-sidebar__day">
                            <span class="schedule-sidebar__day-title">Выбрано</span>
                            <span>{{ formattedDate.day }}</span>
                            <span>{{ formattedDate.time }}</span>
                        </div>
                    </div>
                </AnimationTransition>
            </template>
            <template #menu-header>
                <MessengerLoader class="schedule__loader" :active="eventsLoading" />
            </template>
        </VueDatePicker>
        <ValidationMessage v-if="hasValidationError && !disabled" :message="error" />
    </div>
</template>
<script setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import DatePickerTooltip from '@/components/common/Forms/DatePicker/DatePickerTooltip.vue';
import dayjs from 'dayjs';
import { computed, ref, toRef, useTemplateRef, watch } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import ValidationMessage from '@/components/common/Forms/VaildationMessage.vue';
import { useFormControlValidation } from '@/composables/useFormControlValidation.js';
import MessengerLoader from '@/components/Messenger/MessengerLoader.vue';

const modelValue = defineModel();
const emit = defineEmits(['change', 'range-start', 'range-end', 'update-month-year']);

const props = defineProps({
    markers: {
        type: Array,
        default: () => []
    },
    size: {
        type: String,
        default: '100px'
    },
    presetsLabel: String,
    label: String,
    minDate: [Date, String],
    maxDate: [Date, String],
    required: Boolean,
    disabled: Boolean,
    range: Boolean,
    presets: Array,
    v$: Object,
    startDate: [Date, String],
    focusStartDate: Boolean,
    eventsLoading: Boolean
});

const formattedDate = computed(() => {
    const dayjs_date = dayjs(modelValue.value);

    return {
        day: dayjs_date.format('D MMMM'),
        time: dayjs_date.format('HH:mm')
    };
});

const _presets = computed(() => {
    if (!props.presets?.length) return undefined;

    if (isNotNullish(props.presetsLabel)) {
        return [
            {
                slot: 'presets-label',
                value: new Date(),
                label: props.presetsLabel
            },
            ...props.presets
        ];
    }

    return props.presets;
});

function onInput(value) {
    if (value !== modelValue.value) {
        modelValue.value = value;
        validate();
        emit('change', value);
    }
}

const { hasValidationError, validate, error } = useFormControlValidation(
    toRef(props, 'v'),
    modelValue,
    { reactive: props.reactive }
);

const datePicker = useTemplateRef('datePicker');

const currentMonth = ref(null);
const currentYear = ref(null);

function onUpdateMonthAndYear({ month, year }) {
    currentMonth.value = month;
    currentYear.value = year;

    emit('update-month-year', { month, year });
}

function setMonthAndYearInPicker(month, year) {
    datePicker.value.setMonthYear({ month, year });
}

watch(
    () => props.startDate,
    () => {
        if (props.startDate && props.focusStartDate) {
            const date = dayjs(props.startDate);
            const [month, year] = [date.month(), date.year()];

            if (month !== currentMonth.value || year !== currentYear.value) {
                setMonthAndYearInPicker(month, year);
            }
        }
    }
);
</script>
