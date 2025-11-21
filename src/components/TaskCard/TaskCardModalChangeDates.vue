<template>
    <UiModal @close="$emit('close')"
custom-close
show
:width="900"
title="Изменение сроков задачи">
        <Loader v-if="loading" small />
        <UiForm>
            <UiFormGroup>
                <UiCol :cols="8">
                    <RadioOptions
                        v-model="startOption"
                        :v="v$.start"
                        :options="startPresets"
                        :rounded="false"
                        required
                        object-key="label"
                        label="Дата исполнения"
                        class="col-12"
                    />
                    <RadioOptions
                        v-model="endOption"
                        :v="v$.end"
                        :options="endPresets"
                        :rounded="false"
                        required
                        object-key="label"
                        label="Время на выполнение"
                        class="col-12 mt-3"
                    />
                </UiCol>
                <UiCol :cols="4" class="task-form__dates" :class="{ active: calendarIsActive }">
                    <DatePicker
                        v-model="calendarDate"
                        @range-start="startOption = CUSTOM_START_OPTION"
                        @range-end="endOption = CUSTOM_END_OPTION"
                        :v="v$.start"
                        size="30px"
                        label="Календарь"
                        range
                    />
                </UiCol>
            </UiFormGroup>
        </UiForm>
        <template #actions="{ close }">
            <UiButton @click="submit"
color="success-light"
icon="fa-solid fa-check"
small
:loading>
                Сохранить
            </UiButton>
            <UiButton @click="close" color="light" icon="fa-solid fa-ban" small>Отмена</UiButton>
        </template>
    </UiModal>
</template>

<script setup>
import { computed, reactive, ref, shallowRef, toRef, watch } from 'vue';
import { helpers, minValue, required } from '@vuelidate/validators';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import { useValidation } from '@/composables/useValidation.js';
import Loader from '@/components/common/Loader.vue';
import { dayjsFromServer, toServerDate } from '@/utils/formatters/date.ts';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import dayjs from 'dayjs';
import { useDebounceFn } from '@vueuse/core';
import UiCol from '@/components/common/UI/UiCol.vue';
import DatePicker from '@/components/common/Forms/DatePicker/DatePicker.vue';
import { isNullish } from '@/utils/helpers/common/isNullish';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';

const emit = defineEmits(['confirm', 'close']);

const props = defineProps({
    loading: Boolean,
    startDate: String,
    endDate: String
});

function prepareDate(date) {
    return date ? dayjsFromServer(date).toDate() : null;
}

const form = reactive({
    start: prepareDate(props.startDate),
    end: prepareDate(props.endDate)
});

const { v$, validate } = useValidation(
    {
        start: {
            required: helpers.withMessage('Укажите дату исполнения задачи', required)
        },
        end: {
            minValue: helpers.withMessage(
                'Дата начала задачи должна быть раньше даты истечения',
                minValue(toRef(() => form.start))
            )
        }
    },
    form
);

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    emit('confirm', {
        start: toServerDate(form.start),
        end: toServerDate(form.end)
    });
}

// date

const startOption = ref(isNullish(props.startDate) ? 7 : 100);
const endOption = ref(isNullish(props.endDate) ? 4 : 100);

const isCustomEndDate = ref(false);

const calendarIsActive = computed(
    () =>
        Number(endOption.value) === CUSTOM_END_OPTION ||
        Number(endOption.value) === CUSTOM_START_OPTION
);

const calendarDate = computed({
    get() {
        return [form.start, form.end];
    },
    set(value) {
        form.start = value[0];
        form.end = value[1];
    }
});

watch(startOption, value => {
    if (isNullish(value)) {
        form.start = null;
        return;
    }

    const startDate = startPresets.value[value].value;

    if (isNotNullish(startDate)) {
        form.start = startDate;

        if (isNotNullish(endOption.value)) {
            generateEndPresets();

            const endValue = endPresets.value[endOption.value].value;

            if (isNotNullish(endValue)) {
                form.end = endValue;
            } else if (!isCustomEndDate.value) {
                endOption.value = 4;
            }
        }
    }
});

watch(endOption, value => {
    if (isNullish(value)) {
        form.end = null;
        return;
    }

    const endDate = endPresets.value[value].value;

    if (isNotNullish(endDate)) {
        form.end = endDate;
    } else {
        isCustomEndDate.value = true;
    }
});

function getPreparedStartDate(addCount, addUnit = 'day') {
    return dayjs().add(addCount, addUnit).toDate();
}

const CUSTOM_START_OPTION = 100;

function generateStartPresets() {
    startPresets.value = {
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
            label: 'Выбрать вручную..'
        }
    };
}

const startPresets = shallowRef([]);

generateStartPresets();

function getPreparedEndDate(addCount, addUnit = 'day') {
    return dayjs(form.start).add(addCount, addUnit).toDate();
}

const CUSTOM_END_OPTION = 100;

function generateEndPresets() {
    endPresets.value = {
        1: {
            value: getPreparedEndDate(1),
            label: '1 день'
        },
        2: {
            value: getPreparedEndDate(3),
            label: '3 дня'
        },
        3: {
            value: getPreparedEndDate(5),
            label: '5 дней'
        },
        4: {
            key: 7,
            value: getPreparedEndDate(7),
            label: 'Неделя'
        },
        5: {
            value: getPreparedEndDate(14),
            label: '2 недели'
        },
        6: {
            value: getPreparedEndDate(1, 'month'),
            label: 'Месяц'
        },
        7: {
            value: getPreparedEndDate(3, 'month'),
            label: '3 месяца'
        },
        8: {
            value: getPreparedEndDate(6, 'month'),
            label: 'Пол года'
        },
        9: {
            value: getPreparedEndDate(9, 'month'),
            label: '9 месяцев'
        },
        100: {
            value: null,
            icon: 'fa-solid fa-calendar',
            label: 'Выбрать вручную..'
        }
    };
}

const endPresets = shallowRef([]);
generateEndPresets();

const debouncedGenerateEndPresets = useDebounceFn(generateEndPresets, 300);

watch(() => form.start, debouncedGenerateEndPresets);
</script>
