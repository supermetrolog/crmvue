<template>
    <UiModal
        v-model:visible="isVisible"
        @close="close"
        :title="isEditing ? `Редактирование задачи #${props?.id}` : 'Создание задачи'"
        :width="1200"
        :close-on-outside-click="false"
        custom-close
        class="task-form"
    >
        <Stepper v-model:step="step"
@complete="submit"
:steps="steps"
:v="v$.form"
keep-alive>
            <template #1>
                <UiField v-if="isEditing" color="light" class="task-form__warning mb-2 mx-auto">
                    <i class="fa-solid fa-warning" />
                    <span>
                        Для изменения исполнителя воспользуйтесь отдельной функций "Переназначить" в
                        карточке задачи.
                    </span>
                </UiField>
                <Spinner v-if="consultantsIsLoading" label="Загрузка сотрудников.." center />
                <UserPicker
                    v-else
                    v-model="form.user_id"
                    :disabled="isEditing"
                    single
                    :users="consultants"
                >
                    <template v-if="!isEditing" #after-search>
                        <div class="d-flex gap-2 mt-2">
                            <UiButton
                                @click.prevent="assignToSelf"
                                small
                                color="light"
                                icon="fa-solid fa-user-astronaut"
                                :disabled="assignedToSelf"
                            >
                                Назначить себе
                            </UiButton>
                            <UiButton
                                @click.prevent="assignToModerator"
                                small
                                color="light"
                                icon="fa-solid fa-user-tie"
                                :disabled="!canBeAssignedToModerator || assignedToModerator"
                            >
                                Назначить офис-менеджеру
                            </UiButton>
                        </div>
                    </template>
                </UserPicker>
            </template>
            <template #2>
                <Spinner v-if="consultantsIsLoading" center />
                <UserPicker v-else v-model="form.observers" :users="consultantsForObservers" />
            </template>
            <template #3>
                <div class="row">
                    <div class="col-7">
                        <div class="row">
                            <RadioOptions
                                v-model="form.date.startOption"
                                :v="v$.form.date.start"
                                :options="startPresets"
                                :rounded="false"
                                required
                                object-key="label"
                                label="Начать выполнение"
                                class="col-12"
                            />
                            <RadioOptions
                                v-model="form.date.endOption"
                                class="col-12 mt-3"
                                label="Время на выполнение"
                                :v="v$.form.date.end"
                                :options="endPresets"
                                :rounded="false"
                                required
                                object-key="label"
                            />
                        </div>
                    </div>
                    <div class="col-5 task-form__dates" :class="{ active: calendarIsActive }">
                        <DatePicker
                            v-model="calendarDate"
                            @range-start="form.date.startOption = CUSTOM_START_OPTION"
                            @range-end="form.date.endOption = CUSTOM_END_OPTION"
                            :min-date="!isEditing ? new Date() : undefined"
                            :v="v$.form.date.start"
                            presets-label="Начать через"
                            size="55px"
                            label="Календарь"
                            range
                        />
                    </div>
                </div>
            </template>
            <template #4>
                <div class="row">
                    <MultiSelect
                        v-model="form.tags"
                        label="Тэги"
                        mode="tags"
                        searchable
                        class="col-12 mb-2"
                        :options="getTagsOptions"
                        :resolve-on-load="true"
                        :close-on-select="false"
                        placeholder="&nbsp;&nbsp;Выберите тэг.."
                    >
                        <template #option="{ option }">
                            <TaskTagOption :tag="option" />
                        </template>
                        <template #tag="{ option, disabled, handleTagRemove }">
                            <div
                                class="multiselect-tag"
                                :style="{ backgroundColor: '#' + option.color, color: '#fff' }"
                            >
                                <span>{{ option.label }}</span>
                                <i
                                    v-if="!disabled"
                                    v-tippy="'Удалить'"
                                    @click="handleTagRemove(option, $event)"
                                    class="ml-1 fa-solid fa-close"
                                />
                            </div>
                        </template>
                    </MultiSelect>
                </div>
                <div class="row">
                    <UiTextarea
                        ref="titleEl"
                        v-model="form.title"
                        :v="v$.form.title"
                        :min-height="50"
                        :max-height="70"
                        auto-height
                        class="col-12"
                        label="Заголовок задачи"
                        placeholder="Укажите основную суть задачи.."
                        required
                    />
                    <VueEditor
                        v-model="form.message"
                        :autofocus="autofocusMessage"
                        :min-height="90"
                        :max-height="200"
                        :toolbar="false"
                        label="Описание задачи"
                        placeholder="Дайте дополнительные комментарии, опишите алгоритмы выполнения.."
                        :class="{ 'col-7': hasCustomDescription, 'col-12': !hasCustomDescription }"
                    />
                    <FormModalTaskDescription
                        v-if="hasCustomDescription"
                        :template="additionalContent.modelType"
                        :info="additionalContent"
                        class="col-5"
                    />
                    <Spinner v-if="filesIsLoading" label="Загрузка файлов.." center />
                    <FileInput
                        v-else
                        v-model:native="form.files"
                        v-model:data="form.current_files"
                        class="col-12"
                        label="Файлы или фотографии к задаче"
                    />
                </div>
            </template>
            <template #5>
                <InProgress />
            </template>
        </Stepper>
    </UiModal>
</template>
<script setup>
import Stepper from '@/components/common/Stepper/Stepper.vue';
import DatePicker from '@/components/common/Forms/DatePicker/DatePicker.vue';
import Spinner from '@/components/common/Spinner.vue';
import UserPicker from '@/components/common/Forms/UserPicker/UserPicker.vue';
import {
    helpers,
    maxLength,
    minLength,
    minValue,
    required,
    requiredIf
} from '@vuelidate/validators';
import { useStore } from 'vuex';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import TaskTagOption from '@/components/common/Forms/TaskTagOption.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import {
    computed,
    nextTick,
    onUnmounted,
    reactive,
    ref,
    shallowRef,
    toRef,
    useTemplateRef,
    watch
} from 'vue';
import dayjs from 'dayjs';
import { useTagsOptions } from '@/composables/options/useTagsOptions.js';
import { taskOptions } from '@/const/options/task.options.js';
import FormModalTaskDescription from '@/components/Forms/FormModalTaskDescription.vue';
import { useAuth } from '@/composables/useAuth';
import { useDebounceFn, useTimeoutFn } from '@vueuse/core';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import FileInput from '@/components/common/Forms/FileInput.vue';
import api from '@/api/api.js';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiField from '@/components/common/UI/UiField.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useValidation } from '@/composables/useValidation.js';
import { isNullish } from '@/utils/helpers/common/isNullish.ts';
import { isString } from '@/utils/helpers/string/isString.js';
import { dayjsFromServer, toServerDate } from '@/utils/formatters/date.ts';
import InProgress from '@/components/common/InProgress.vue';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';

const store = useStore();
const { getTagsOptions } = useTagsOptions();
const { currentUser } = useAuth();

const steps = reactive([
    {
        name: 'user_id',
        title: 'Выбор исполнителя',
        icon: 'fa-solid fa-user'
    },
    {
        name: 'observers',
        title: 'Наблюдатели',
        icon: 'fa-solid fa-eye'
    },
    {
        name: 'date',
        title: 'Выбор даты',
        icon: 'fa-solid fa-clock'
    },
    {
        name: 'message',
        title: 'Параметры задачи',
        icon: 'fa-solid fa-pen'
    },
    {
        name: 'relations',
        title: computed(() => `Связи (${form.value.relations?.length ?? 0})`),
        icon: 'fa-solid fa-link'
    }
]);

const autofocusMessage = ref(false);

const step = ref(0);
const consultants = ref([]);
const consultantsIsLoading = ref(false);
const hasCustomDescription = ref(false);
const additionalContent = shallowRef({});

const titleEl = useTemplateRef('titleEl');

const form = ref({
    title: null,
    message: null,
    date: {
        end: dayjs().add(7, 'day').toDate(),
        start: new Date(),
        startOption: 1,
        endOption: 4
    },
    tags: [],
    user_id: null,
    status: 1,
    observers: [],
    files: [],
    current_files: [],
    relations: [],
    type: 'base'
});

const consultantsForObservers = computed(() => {
    if (store.getters.isAdmin) return consultants.value;
    return consultants.value.filter(
        element => element.id !== form.value.user_id && element.id !== store.getters.THIS_USER.id
    );
});

watch(step, value => {
    if (value === 2) {
        nextTick(() => useTimeoutFn(titleEl.value.focus, 1000, { immediate: true }));
    }
});

const clearForm = () => {
    form.value = {
        title: null,
        message: null,
        date: {
            end: dayjs().add(7, 'day').toDate(),
            start: new Date(),
            startOption: 1,
            endOption: 4
        },
        user_id: null,
        status: 1,
        tags: [],
        observers: [],
        files: [],
        current_files: [],
        relations: [],
        type: 'base'
    };

    v$.value.$reset();
};

const fetchConsultants = async () => {
    consultantsIsLoading.value = true;

    consultants.value = await store.dispatch('getConsultants');

    consultantsIsLoading.value = false;
};

function parseDate(date, defaultValue = null) {
    if (isNullish(date)) return defaultValue;

    if (isString(date) && isEditing.value) return dayjsFromServer(date).toDate();

    return dayjs(date).toDate();
}

const {
    isVisible,
    onPopupShowed,
    destroy: destroyPopup,
    submit: _submit,
    cancel,
    props
} = useAsyncPopup('taskCreator');

onPopupShowed(() => {
    step.value = props.value?.step ?? 0;
    hasCustomDescription.value = props.value?.customDescription ?? false;
    additionalContent.value = props.value?.additionalContent ?? {};

    externalPresets.call = props.value?.callPresets ?? false;

    if (!consultants.value.length) fetchConsultants();

    generateStartPresets();

    if (props.value) {
        form.value = {
            title: props.value.title,
            message: props.value.message,
            date: {
                start: parseDate(props.value.start, startPresets.value[1].value),
                startOption: isNullish(props.value.start) ? 1 : 100,
                end: parseDate(props.value.end, endPresets.value[4].value),
                endOption: isNullish(props.value.end) ? 4 : 100
            },
            user_id: props.value.user_id,
            status: props.value.status ?? taskOptions.statusTypes.NEW,
            tags: props.value.tags ? props.value.tags.map(element => element.id) : [],
            observers: props.value.observers
                ? props.value.observers.map(element => element.user_id)
                : [],
            current_files: [],
            files: [],
            relations: props.value.relations ?? [],
            type: props.value.type
        };

        if (isEditing.value && props.value.files_count > 0) fetchFiles();
    }

    if (props.value?.focusMessage) autofocusMessage.value = true;
});

// presets

const externalPresets = reactive({
    call: false
});

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
                        requiredIf(() => !isEditing.value, minValue(new Date()))
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

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    _submit(formToPayload());
    clearForm();
}

const close = () => {
    cancel();
    clearForm();
};

const isEditing = computed(() => isNotNullish(props.value?.id));

onUnmounted(() => {
    destroyPopup();
});

// files

const filesIsLoading = ref(false);

async function fetchFiles() {
    filesIsLoading.value = true;

    const response = await api.task.getFiles(props.value.id);
    if (response) form.value.current_files = response;

    filesIsLoading.value = false;
}

// assigning

const assignedToSelf = computed(() => form.value.user_id === currentUser.value.id);

function assignToSelf() {
    form.value.user_id = currentUser.value.id;
}

const canBeAssignedToModerator = computed(() => isNotNullish(store.getters?.moderator));
const assignedToModerator = computed(() => form.value.user_id === store.getters?.moderator?.id);

function assignToModerator() {
    form.value.user_id = store.getters.moderator.id;
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
