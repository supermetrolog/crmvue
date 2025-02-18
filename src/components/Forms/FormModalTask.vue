<template>
    <Modal
        @close="close"
        :show="isVisible"
        width="1200"
        :close-on-outside-click="false"
        :title="isEditing ? 'Редактирование задачи' : 'Создание задачи'"
    >
        <div>
            <DashboardTableTasksItem :task="taskPreview" />
        </div>
        <Stepper v-model:step="step" @complete="submit" :steps="steps" :v="v$.form" keep-alive>
            <template #1>
                <Spinner v-if="consultantsIsLoading" center />
                <UserPicker
                    v-else
                    v-model="form.user_id"
                    :disabled="isEditing"
                    single
                    :users="consultants"
                />
            </template>
            <template #2>
                <div class="d-flex justify-content-center gap-3">
                    <div class="date-range-presets">
                        <p class="date-range-presets__title">
                            Шаблоны продолжительности выполнения
                        </p>
                        <div class="date-range-presets__list">
                            <template v-if="externalPresets.call">
                                <DashboardChip
                                    v-for="preset in callPresets"
                                    :key="preset.id"
                                    @click="selectRange(preset.value, preset.unit)"
                                    class="date-range-presets__item dashboard-bg-success-l"
                                    :class="{
                                        active: currentRange === preset.value && !preset.hidden
                                    }"
                                >
                                    {{ preset.label }}
                                </DashboardChip>
                            </template>
                            <DashboardChip
                                v-for="preset in presets"
                                :key="preset.id"
                                @click="selectRange(preset.value, preset.unit)"
                                class="date-range-presets__item dashboard-bg-success-l"
                                :class="{ active: currentRange === preset.value && !preset.hidden }"
                            >
                                {{ preset.label }}
                            </DashboardChip>
                        </div>
                    </div>
                    <DatePicker v-model="form.date.end" size="50px" />
                </div>
            </template>
            <template #3>
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
                    <Textarea
                        ref="messageEl"
                        v-model="form.message"
                        :autofocus="autofocusMessage"
                        :v="v$.form.message"
                        minlength="16"
                        :class="{ 'col-7': hasCustomDescription, 'col-12': !hasCustomDescription }"
                        label="Описание задачи"
                        placeholder="Заполните описание.."
                        helper="Опишите задачу, что нужно сделать, почему и с каким объектом/компанией это связано!"
                        required
                    />
                    <FormModalTaskDescription
                        v-if="hasCustomDescription"
                        :template="additionalContent.modelType"
                        :info="additionalContent"
                        class="col-5"
                    />
                </div>
            </template>
            <template #4>
                <Spinner v-if="consultantsIsLoading" center />
                <UserPicker v-else v-model="form.observers" :users="consultantsForObservers" />
            </template>
            <template #5>
                <Spinner v-if="filesIsLoading" label="Загрузка файлов.." center />
                <FileInput
                    v-else
                    v-model:native="form.files"
                    v-model:data="form.current_files"
                    label="Файлы или фотографии к задаче"
                />
            </template>
        </Stepper>
    </Modal>
</template>
<script setup>
import Stepper from '@/components/common/Stepper.vue';
import DatePicker from '@/components/common/Forms/DatePicker/DatePicker.vue';
import Spinner from '@/components/common/Spinner.vue';
import Modal from '@/components/common/Modal.vue';
import UserPicker from '@/components/common/Forms/UserPicker/UserPicker.vue';
import { helpers, minLength, required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import Textarea from '@/components/common/Forms/Textarea.vue';
import { useStore } from 'vuex';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import TaskTagOption from '@/components/common/Forms/TaskTagOption.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import {
    computed,
    nextTick,
    onUnmounted,
    ref,
    shallowRef,
    useTemplateRef,
    watch,
    reactive
} from 'vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import dayjs from 'dayjs';
import { useTagsOptions } from '@/composables/options/useTagsOptions.js';
import { taskOptions } from '@/const/options/task.options.js';
import FormModalTaskDescription from '@/components/Forms/FormModalTaskDescription.vue';
import { useAuth } from '@/composables/useAuth.js';
import DashboardTableTasksItem from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItem.vue';
import { useTimeoutFn } from '@vueuse/core';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import FileInput from '@/components/common/Forms/FileInput.vue';
import api from '@/api/api.js';

const store = useStore();
const { getTagsOptions } = useTagsOptions();
const { currentUser } = useAuth();

const steps = [
    {
        name: 'user_id',
        title: 'Выбор сотрудников',
        icon: 'fa-solid fa-user'
    },
    {
        name: 'date',
        title: 'Выбор даты',
        icon: 'fa-solid fa-clock'
    },
    {
        name: 'message',
        title: 'Описание задачи',
        icon: 'fa-solid fa-pen'
    },
    {
        name: 'observers',
        title: 'Наблюдатели',
        icon: 'fa-solid fa-eye'
    },
    {
        name: 'files',
        title: 'Файлы',
        icon: 'fa-solid fa-file-circle-plus'
    }
];

const presets = [
    {
        id: 1,
        value: 1,
        label: '1 день'
    },
    {
        id: 3,
        value: 3,
        label: '3 дня'
    },
    {
        id: 4,
        value: 5,
        label: '5 дней'
    },
    {
        id: 5,
        value: 7,
        label: 'Неделя'
    },
    {
        id: 6,
        value: 14,
        label: '2 недели'
    },
    {
        id: 7,
        value: 30,
        label: 'Месяц'
    },
    {
        id: 8,
        value: 91,
        label: '3 месяца'
    },
    {
        id: 9,
        value: 183,
        label: 'Пол года'
    },
    {
        id: 10,
        value: 273,
        label: '9 месяцев'
    }
];

const callPresets = [
    {
        id: 11,
        value: 30,
        hidden: true,
        unit: 'minute',
        label: '30 минут'
    },
    {
        id: 12,
        value: 1,
        hidden: true,
        unit: 'hour',
        label: '1 час'
    },
    {
        id: 13,
        value: 2,
        hidden: true,
        unit: 'hour',
        label: '2 часа'
    },
    {
        id: 14,
        value: 3,
        hidden: true,
        unit: 'hour',
        label: '3 часа'
    }
];

const autofocusMessage = ref(false);

const step = ref(0);
const consultants = ref([]);
const consultantsIsLoading = ref(false);
const hasCustomDescription = ref(false);
const additionalContent = shallowRef({});

const messageEl = useTemplateRef('messageEl');

const form = ref({
    message: null,
    date: {
        end: null,
        start: null
    },
    tags: [],
    user_id: null,
    status: 1,
    observers: [],
    files: [],
    current_files: []
});

const externalPresets = reactive({
    call: false
});

const taskPreview = computed(() => {
    return {
        tags: [],
        id: 1,
        created_by_type: 'user',
        created_by_id: currentUser.value.id,
        created_by: currentUser.value,
        message: form.value.message || 'Заполните описание..',
        status: 1,
        observers: selectedObservers.value,
        user_id: form.value.user_id,
        user: selectedUser.value,
        end: form.value.date.end
    };
});

const selectedUser = computed(() => {
    return consultants.value.find(element => element.id === form.value.user_id);
});

const selectedObservers = computed(() => {
    return form.value.observers.reduce((acc, element) => {
        const user = consultants.value.find(el => el.id === element);

        if (user)
            acc.push({
                user_id: element,
                user
            });

        return acc;
    }, []);
});

const consultantsForObservers = computed(() => {
    if (store.getters.isAdmin) return consultants.value;
    return consultants.value.filter(
        element => element.id !== form.value.user_id && element.id !== store.getters.THIS_USER.id
    );
});

const currentRange = computed(() => {
    if (form.value.date.end === null) return 0;
    return Math.round(dayjs(form.value.date.end).diff(dayjs(), 'day', true));
});

watch(step, value => {
    if (value === 2) nextTick(() => useTimeoutFn(messageEl.value.focus, 1000, { immediate: true }));
});

const clearForm = () => {
    form.value = {
        message: null,
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
};

const fetchConsultants = async () => {
    consultantsIsLoading.value = true;

    consultants.value = await store.dispatch('getConsultants');

    consultantsIsLoading.value = false;
};

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

    if (props.value) {
        form.value = {
            message: props.value.message,
            date: {
                end: props.value.end,
                start: props.value.start
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
});

const v$ = useVuelidate(
    {
        form: {
            date: {
                end: {
                    required: helpers.withMessage('Выберите дату истечения задачи!', required)
                }
            },
            user_id: {
                minLength: helpers.withMessage('Выберите сотрудника!', required)
            },
            message: {
                required: helpers.withMessage('Описание задачи является обязательным!', required),
                minLength: helpers.withMessage(
                    'Описание задачи не может быть меньше 16 символов!',
                    minLength(16)
                )
            }
        }
    },
    { form }
);

const formToPayload = () => {
    return {
        start: form.value.date.start,
        end: form.value.date.end,
        user_id: Number(form.value.user_id),
        message: form.value.message,
        status: form.value.status,
        tag_ids: form.value.tags,
        observer_ids: form.value.observers,
        files: form.value.files,
        current_files: form.value.current_files.map(element => element.id)
    };
};

const submit = () => {
    _submit(formToPayload());
    clearForm();
};

const close = () => {
    cancel();
    clearForm();
};

const selectRange = (range, unit = 'day') => {
    form.value.date.end = dayjs().add(range, unit).toDate();
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
</script>
