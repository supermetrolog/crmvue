<template>
    <UiModal
        v-model:visible="isVisible"
        @close="close"
        :title="isEditing ? `Редактирование задачи #${props.id}` : 'Создание задачи'"
        :width="850"
        :close-on-outside-click="false"
        custom-close
    >
        <UiForm>
            <UiFormGroup>
                <ConsultantPicker
                    v-model="form.user_id"
                    :v="v$.form.user_id"
                    :disabled="isEditing"
                    :options="getConsultantsOptions"
                    label="1. Исполнитель"
                    class="col-12"
                    required
                >
                    <template #after>
                        <UiField v-if="isEditing" color="light">
                            <i class="fa-solid fa-warning" />
                            <span>
                                Для изменения исполнителя воспользуйтесь отдельной функций
                                "Переназначить" в карточке задачи.
                            </span>
                        </UiField>
                        <div v-else class="d-flex gap-2">
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
                </ConsultantPicker>
                <ConsultantPicker
                    v-model="form.observers"
                    :options="getObserversConsultantsOptions"
                    :close-on-select="false"
                    :v="v$.form.observers"
                    mode="multiple"
                    label="Наблюдатели"
                    class="col-12"
                    multiple-property="label"
                    multiple
                />
            </UiFormGroup>
            <UiFormDivider />
            <UiFormGroup>
                <UiCol :cols="12">
                    <p class="form__label mb-0">2. Сроки исполнения</p>
                </UiCol>
                <UiCol :cols="6">
                    <UiDateInput
                        v-model="form.date.start"
                        :presets="startPresets"
                        :min-date="!isEditing ? new Date() : undefined"
                        :v="v$.form.date.start"
                        presets-label="Начать через"
                        placeholder="Дата старта"
                        label="Дата старта"
                        required
                    >
                        <template #after>
                            <UiButton
                                @click.prevent="setStartToday"
                                small
                                color="light"
                                icon="fa-regular fa-clock"
                            >
                                Сегодня
                            </UiButton>
                        </template>
                    </UiDateInput>
                </UiCol>
                <UiCol :cols="6">
                    <UiDateInput
                        v-model="form.date.end"
                        :presets="endPresets"
                        :min-date="form.date.start"
                        :v="v$.form.date.end"
                        :start-date="form.date.start"
                        :focus-start-date="endDateIsFocusedToStart"
                        presets-label="Выполнить за"
                        placeholder="Дата окончания"
                        label="Дата окончания"
                        required
                    />
                </UiCol>
                <AnimationTransition :speed="0.5">
                    <UiCol v-if="form.date.end && form.date.start" :cols="12">
                        <UiChip coolor="success">
                            <i class="fa-regular fa-clock" />
                            <span>На выполнение: {{ duration }}</span>
                        </UiChip>
                    </UiCol>
                </AnimationTransition>
            </UiFormGroup>
            <UiFormDivider />
            <UiFormGroup>
                <UiTextarea
                    v-model="form.title"
                    :v="v$.form.title"
                    :min-height="50"
                    :max-height="70"
                    auto-height
                    class="col-12"
                    label="3. Заголовок задачи"
                    placeholder="Заполните заголовок.."
                    required
                />
                <UiTextarea
                    v-model="form.message"
                    :autofocus="autofocusMessage"
                    :min-height="70"
                    :max-height="200"
                    auto-height
                    :class="{ 'col-7': hasCustomDescription, 'col-12': !hasCustomDescription }"
                    label="Описание задачи"
                    placeholder="Заполните описание.."
                    helper="Опишите задачу. Что нужно сделать, почему и с каким объектом/компанией это связано!"
                />
                <FormModalTaskDescription
                    v-if="hasCustomDescription"
                    :template="additionalContent.modelType"
                    :info="additionalContent"
                    class="col-5"
                />
                <MultiSelect
                    v-model="form.tags"
                    label="Тэги"
                    mode="tags"
                    searchable
                    class="col-12"
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
                            <UiTooltipIcon
                                v-if="!disabled"
                                @click="handleTagRemove(option, $event)"
                                tooltip="Удалить"
                                icon="fa-solid fa-close"
                                class="ml-1"
                            />
                        </div>
                    </template>
                </MultiSelect>
            </UiFormGroup>
            <UiFormDivider />
            <UiFormGroup>
                <Spinner v-if="filesIsLoading" label="Загрузка файлов.." center />
                <FileInput
                    v-else
                    v-model:native="form.files"
                    v-model:data="form.current_files"
                    label="4. Файлы или фотографии"
                    short
                    class="col-12"
                />
            </UiFormGroup>
        </UiForm>
        <template #actions>
            <UiButton @click="submit" color="success-light" icon="fa-solid fa-check" bolder small>
                Сохранить
            </UiButton>
            <UiButton @click="close" color="light" icon="fa-solid fa-ban" bolder small>
                Отмена
            </UiButton>
        </template>
    </UiModal>
</template>
<script setup>
import Spinner from '@/components/common/Spinner.vue';
import {
    helpers,
    maxLength,
    minLength,
    minValue,
    required,
    requiredIf
} from '@vuelidate/validators';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import TaskTagOption from '@/components/common/Forms/TaskTagOption.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import { computed, onUnmounted, ref, shallowRef, reactive, toRef, watch } from 'vue';
import dayjs from 'dayjs';
import { useTagsOptions } from '@/composables/options/useTagsOptions.js';
import { taskOptions } from '@/const/options/task.options.js';
import FormModalTaskDescription from '@/components/Forms/FormModalTaskDescription.vue';
import { useAuth } from '@/composables/useAuth.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import FileInput from '@/components/common/Forms/FileInput.vue';
import api from '@/api/api.js';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import { useValidation } from '@/composables/useValidation.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import UiDateInput from '@/components/common/Forms/UiDateInput.vue';
import { useDebounceFn } from '@vueuse/core';
import UiChip from '@/components/common/UI/UiChip.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { useStore } from 'vuex';
import UiField from '@/components/common/UI/UiField.vue';
import { isString } from '@/utils/helpers/string/isString.js';
import { dayjsFromMoscow } from '@/utils/formatters/date.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';

const { getTagsOptions } = useTagsOptions();
const { getConsultantsOptions } = useConsultantsOptions();

const { currentUserIsAdmin, currentUser } = useAuth();

// form

const autofocusMessage = ref(false);
const hasCustomDescription = ref(false);
const additionalContent = shallowRef({});

const form = ref({
    message: null,
    title: null,
    date: {
        end: null,
        start: new Date()
    },
    tags: [],
    user_id: null,
    status: 1,
    observers: [],
    files: [],
    current_files: []
});

const duration = computed(() => {
    return dayjs.duration(dayjs(form.value.date.end).diff(dayjs(form.value.date.start))).humanize();
});

async function getObserversConsultantsOptions() {
    const consultantsOptions = await getConsultantsOptions();

    if (currentUserIsAdmin.value) return consultantsOptions;

    return consultantsOptions.filter(
        element => element.id !== form.value.user_id && element.id !== currentUser.value.id
    );
}

function clearForm() {
    form.value = {
        message: null,
        title: null,
        date: {
            end: null,
            start: null
        },
        user_id: null,
        status: 1,
        tags: [],
        observers: [],
        files: [],
        current_files: []
    };
}

const {
    isVisible,
    onPopupShowed,
    destroy: destroyPopup,
    submit: _submit,
    cancel,
    props
} = useAsyncPopup('taskCreator');

function parseDate(date, defaultValue = null) {
    if (isNullish(date)) return defaultValue;
    if (isString(date) && isEditing.value) return dayjsFromMoscow(date).toDate();
    return dayjs(date).toDate();
}

onPopupShowed(() => {
    hasCustomDescription.value = props.value?.customDescription ?? false;
    additionalContent.value = props.value?.additionalContent ?? {};

    externalPresets.call = props.value?.callPresets ?? false;

    if (props.value) {
        form.value = {
            message: props.value.message,
            title: props.value.title,
            date: {
                end: parseDate(props.value.end),
                start: parseDate(props.value.start)
            },
            user_id: props.value.user_id,
            status: props.value.status ?? taskOptions.statusTypes.NEW,
            tags: props.value.tags ? props.value.tags.map(element => element.id) : [],
            observers: props.value.observers
                ? props.value.observers.map(element => element.user_id)
                : [],
            current_files: [],
            files: []
        };

        if (isEditing.value && props.value.files_count > 0) fetchFiles();
    }

    if (props.value?.focusMessage) autofocusMessage.value = true;

    generateStartPresets();
});

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

function formToPayload() {
    return {
        start: form.value.date.start,
        end: form.value.date.end,
        user_id: Number(form.value.user_id),
        message: form.value.message,
        title: form.value.title,
        status: form.value.status,
        tag_ids: form.value.tags,
        observer_ids: form.value.observers,
        files: form.value.files,
        current_files: form.value.current_files.map(element => element.id)
    };
}

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

    try {
        const response = await api.task.getFiles(props.value.id);
        if (response) form.value.current_files = response;
    } finally {
        filesIsLoading.value = false;
    }
}

// presets

// presets

const externalPresets = reactive({
    call: false
});

function generateStartPresets() {
    startPresets.value = [
        ...(externalPresets.call ? generateCallStartPresets() : []),
        {
            value: dayjs().add(1, 'day').toDate(),
            label: '1 день'
        },
        {
            value: dayjs().add(3, 'day').toDate(),
            label: '3 дня'
        },
        {
            value: dayjs().add(5, 'day').toDate(),
            label: '5 дней'
        },
        {
            value: dayjs().add(7, 'day').toDate(),
            label: 'Неделя'
        },
        {
            value: dayjs().add(14, 'day').toDate(),
            label: '2 недели'
        },
        {
            value: dayjs().add(1, 'month').toDate(),
            label: 'Месяц'
        },
        {
            value: dayjs().add(3, 'month').toDate(),
            label: '3 месяца'
        },
        {
            value: dayjs().add(6, 'month').toDate(),
            label: 'Пол года'
        },
        {
            value: dayjs().add(9, 'month').toDate(),
            label: '9 месяцев'
        }
    ];
}

function generateCallStartPresets() {
    return [
        {
            value: dayjs().add(30, 'minute').toDate(),
            label: '30 минут'
        },
        {
            value: dayjs().add(1, 'hour').toDate(),
            label: '1 час'
        },
        {
            value: dayjs().add(2, 'hour').toDate(),
            label: '2 часа'
        },
        {
            value: dayjs().add(3, 'hour').toDate(),
            label: '3 часа'
        }
    ];
}

const startPresets = shallowRef([]);

generateStartPresets();

function generateEndPresets() {
    endPresets.value = [
        ...(externalPresets.call ? generateCallEndPresets() : []),
        {
            value: dayjs(form.value.date.start).add(1, 'day').toDate(),
            label: '1 день'
        },
        {
            value: dayjs(form.value.date.start).add(3, 'day').toDate(),
            label: '3 дня'
        },
        {
            value: dayjs(form.value.date.start).add(5, 'day').toDate(),
            label: '5 дней'
        },
        {
            value: dayjs(form.value.date.start).add(7, 'day').toDate(),
            label: 'Неделя'
        },
        {
            value: dayjs(form.value.date.start).add(14, 'day').toDate(),
            label: '2 недели'
        },
        {
            value: dayjs(form.value.date.start).add(1, 'month').toDate(),
            label: 'Месяц'
        },
        {
            value: dayjs(form.value.date.start).add(3, 'month').toDate(),
            label: '3 месяца'
        },
        {
            value: dayjs(form.value.date.start).add(6, 'month').toDate(),
            label: 'Пол года'
        },
        {
            value: dayjs(form.value.date.start).add(9, 'month').toDate(),
            label: '9 месяцев'
        }
    ];
}

function generateCallEndPresets() {
    return [
        {
            value: dayjs(form.value.date.start).add(30, 'minute').toDate(),
            label: '30 минут'
        },
        {
            value: dayjs(form.value.date.start).add(1, 'hour').toDate(),
            label: '1 час'
        },
        {
            value: dayjs(form.value.date.start).add(2, 'hour').toDate(),
            label: '2 часа'
        },
        {
            value: dayjs(form.value.date.start).add(3, 'hour').toDate(),
            label: '3 часа'
        }
    ];
}

const endPresets = shallowRef([]);
generateEndPresets();

const debouncedGenerateEndPresets = useDebounceFn(generateEndPresets, 500);

watch(() => form.value.date.start, debouncedGenerateEndPresets);

// functions

const assignedToSelf = computed(() => form.value.user_id === currentUser.value.id);

function assignToSelf() {
    form.value.user_id = currentUser.value.id;
}

const store = useStore();

const canBeAssignedToModerator = computed(() => isNotNullish(store.getters?.moderator));
const assignedToModerator = computed(() => form.value.user_id === store.getters?.moderator?.id);

function assignToModerator() {
    form.value.user_id = store.getters.moderator.id;
}

function setStartToday() {
    form.value.date.start = new Date();
}

const endDateIsFocusedToStart = computed(
    () =>
        isNullish(form.value.date.end) ||
        (form.value.date.start && dayjs(form.value.date.end).isBefore(dayjs(form.value.date.start)))
);
</script>
