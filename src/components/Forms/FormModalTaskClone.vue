<template>
    <UiModal
        @close="$emit('close')"
        custom-close
        title="Клонирование задачи"
        :width="900"
        :close-on-outside-click="false"
        class="task-form"
        show
    >
        <Loader
            v-if="isLoading || taskIsLoading"
            :label="taskIsLoading ? 'Загрузка задачи' : 'Создание задачи'"
        />
        <UiForm>
            <UiFormGroup>
                <UiCol :cols="7">
                    <RadioOptions
                        v-model="form.date.startOption"
                        :v="v$.form.date.start"
                        :options="startPresets"
                        :rounded="false"
                        object-key="label"
                        label="Начать выполнение"
                        required
                    />
                    <RadioOptions
                        v-model="form.date.endOption"
                        :v="v$.form.date.end"
                        :options="endPresets"
                        :rounded="false"
                        object-key="label"
                        label="Время на выполнение"
                        class="mt-3"
                        required
                    />
                </UiCol>
                <UiCol :cols="5" class="task-form__dates" :class="{ active: calendarIsActive }">
                    <DatePicker
                        v-model="calendarDate"
                        @range-start="form.date.startOption = CUSTOM_START_OPTION"
                        @range-end="form.date.endOption = CUSTOM_END_OPTION"
                        :v="v$.form.date.start"
                        presets-label="Начать через"
                        size="34px"
                        label="Календарь"
                        range
                    />
                </UiCol>
            </UiFormGroup>
            <UiFormGroup>
                <UiTextarea
                    ref="titleEl"
                    v-model="form.title"
                    :v="v$.form.title"
                    :min-height="50"
                    :max-height="70"
                    auto-height
                    class="col-12"
                    label="Заголовок задачи"
                    required
                />
                <VueEditor
                    v-model="form.message"
                    :min-height="90"
                    :max-height="200"
                    :toolbar="false"
                    label="Описание задачи"
                    class="col-12 mt-2"
                />
            </UiFormGroup>
        </UiForm>
        <template #actions>
            <UiButton
                @click="submit"
                :loading="isLoading"
                color="success-light"
                icon="fa-solid fa-check"
            >
                Сохранить
            </UiButton>
            <UiButton @click="$emit('close')" color="light" icon="fa-solid fa-ban">Отмена</UiButton>
        </template>
    </UiModal>
</template>
<script setup>
import DatePicker from '@/components/common/Forms/DatePicker/DatePicker.vue';
import { helpers, maxLength, minLength, minValue, required } from '@vuelidate/validators';
import { computed, onBeforeMount, ref, shallowRef, toRef, watch } from 'vue';
import dayjs from 'dayjs';
import { useDebounceFn } from '@vueuse/core';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import api from '@/api/api.js';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import { useValidation } from '@/composables/useValidation.js';
import { isNullish } from '@/utils/helpers/common/isNullish.ts';
import { isString } from '@/utils/helpers/string/isString.js';
import { dayjsFromServer, toServerDate } from '@/utils/formatters/date.ts';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import { useAsync } from '@/composables/useAsync';
import { useNotify } from '@/utils/use/useNotify.js';
import Loader from '@/components/common/Loader.vue';
import UiButton from '@/components/common/UI/UiButton.vue';

const emit = defineEmits(['close', 'created']);

const props = defineProps({
    task: Object
});

const form = ref({
    title: props.task.title,
    message: props.task.message,
    date: {
        end: parseDate(props.task.end),
        start: parseDate(props.task.start),
        startOption: 100,
        endOption: 100
    },
    tags: [],
    user_id: props.task.user_id,
    status: 1,
    observers: [],
    files: [],
    current_files: [],
    relations: [],
    type: props.task.type
});

function parseDate(date, defaultValue = null) {
    if (isNullish(date)) return defaultValue;

    if (isString(date)) return dayjsFromServer(date).toDate();

    return dayjs(date).toDate();
}

const taskIsLoading = ref(false);

onBeforeMount(async () => {
    taskIsLoading.value = true;

    try {
        const [{ value: task }, { value: relations }] = await Promise.allSettled([
            api.task.getOne(props.task.id),
            api.task.getRelations(props.task.id)
        ]);

        if (task) {
            form.value = {
                title: task.title,
                message: task.message,
                date: {
                    end: parseDate(task.end),
                    start: parseDate(task.start),
                    startOption: 100,
                    endOption: 100
                },
                tags: task.tags.map(tag => tag.id),
                user_id: task.user_id,
                status: 1,
                observers: task.observers.map(obs => obs.id),
                files: [],
                current_files: [],
                relations: relations.map(({ entity_id, entity_type }) => ({
                    entity_id,
                    entity_type
                })),
                type: task.type
            };
        }
    } finally {
        taskIsLoading.value = false;
    }
});

// presets

function getPreparedStartDate(addCount, addUnit = 'day') {
    return dayjs().add(addCount, addUnit).toDate();
}

const CUSTOM_START_OPTION = 100;

function generateStartPresets() {
    startPresets.value = {
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
            label: 'Выбрать вручную..'
        }
    };
}

const startPresets = shallowRef([]);

generateStartPresets();

function getPreparedEndDate(addCount, addUnit = 'day') {
    return dayjs(form.value.date.start).add(addCount, addUnit).toDate();
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

const debouncedGenerateEndPresets = useDebounceFn(generateEndPresets, 500);

watch(() => form.value.date.start, debouncedGenerateEndPresets);

// validation

const { v$, validate } = useValidation(
    {
        form: {
            date: {
                start: {
                    required: helpers.withMessage('Выберите дату старта задачи!', required),
                    minValue: helpers.withMessage(
                        'Дата начала задачи должна быть больше текущей даты',
                        required
                    )
                },
                end: {
                    required: helpers.withMessage('Выберите дату истечения задачи!', required),
                    minValue: helpers.withMessage(
                        'Дата начала задачи должна быть раньше даты истечения',
                        minValue(toRef(() => form.value.date.start))
                    )
                }
            },
            user_id: {
                minLength: helpers.withMessage('Выберите сотрудника!', required)
            },
            title: {
                required: helpers.withMessage('Заголовок задачи является обязательным!', required),
                minLength: helpers.withMessage(
                    'Заголовок задачи не может быть меньше 16 символов!',
                    minLength(16)
                ),
                maxLength: helpers.withMessage(
                    'Заголовок задачи не может быть больше 255 символов!',
                    maxLength(255)
                )
            }
        }
    },
    { form }
);

const formToPayload = () => {
    return {
        start: toServerDate(form.value.date.start),
        end: toServerDate(form.value.date.end),
        user_id: Number(form.value.user_id),
        title: form.value.title,
        message: form.value.message,
        status: form.value.status,
        tag_ids: form.value.tags,
        observer_ids: form.value.observers,
        files: form.value.files,
        current_files: form.value.current_files.map(element => element.id),
        relations: form.value.relations,
        type: form.value.type
    };
};

const notify = useNotify();

const { isLoading, execute: createTask } = useAsync(() => api.task.create(formToPayload()), {
    onFetchResponse: () => {
        notify.success('Задача успешно создана.');
        emit('close');
    }
});

async function submit() {
    const isValid = await validate();
    if (isValid) await createTask(formToPayload());
}

// dates

const calendarDate = computed({
    get() {
        return [form.value.date.start, form.value.date.end];
    },
    set(value) {
        form.value.date.start = value[0];
        form.value.date.end = value[1];
    }
});

watch(
    () => form.value.date.startOption,
    value => {
        if (isNullish(value)) {
            form.value.date.start = null;
            return;
        }

        const startDate = startPresets.value[value].value;

        if (isNotNullish(startDate)) {
            form.value.date.start = startDate;

            if (isNotNullish(form.value.date.endOption)) {
                debouncedGenerateEndPresets();

                const endValue = endPresets.value[form.value.date.endOption].value;

                if (isNotNullish(endValue)) {
                    form.value.date.end = endValue;
                }
            }
        }
    }
);

watch(
    () => form.value.date.endOption,
    value => {
        if (isNullish(value)) {
            form.value.date.end = null;
            return;
        }

        const endDate = endPresets.value[value].value;

        if (isNotNullish(endDate)) {
            form.value.date.end = endDate;
        }
    }
);

const calendarIsActive = computed(
    () =>
        Number(form.value.date.endOption) === CUSTOM_END_OPTION ||
        Number(form.value.date.startOption) === CUSTOM_START_OPTION
);
</script>
