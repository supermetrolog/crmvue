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
                <Spinner v-if="isLoading" center />
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
                            <DashboardChip
                                v-for="preset in presets"
                                :key="preset.id"
                                @click="selectRange(preset.value)"
                                class="date-range-presets__item dashboard-bg-success-l"
                                :class="{ active: currentRange === preset.value }"
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
                <Spinner v-if="isLoading" center />
                <UserPicker v-else v-model="form.observers" :users="consultantsForObservers" />
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
import { computed, nextTick, onUnmounted, ref, shallowRef, useTemplateRef, watch } from 'vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import dayjs from 'dayjs';
import { useTagsOptions } from '@/composables/options/useTagsOptions.js';
import { taskOptions } from '@/const/options/task.options.js';
import FormModalTaskDescription from '@/components/Forms/FormModalTaskDescription.vue';
import { useAuth } from '@/composables/useAuth.js';
import DashboardTableTasksItem from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItem.vue';
import { useTimeoutFn } from '@vueuse/core';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';

const store = useStore();
const { getTagsOptions } = useTagsOptions();
const { currentUser } = useAuth();

const steps = [
    {
        name: 'user_id',
        title: 'Выбор сотрудников'
    },
    {
        name: 'date',
        title: 'Выбор даты'
    },
    {
        name: 'message',
        title: 'Описание задачи'
    },
    {
        name: 'observers',
        title: 'Наблюдатели'
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

const autofocusMessage = ref(false);

const step = ref(0);
const consultants = ref([]);
const isLoading = ref(false);
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
    observers: []
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
        observers: []
    };
};

const fetchConsultants = async () => {
    isLoading.value = true;
    consultants.value = await store.dispatch('getConsultants');
    isLoading.value = false;
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

    if (!consultants.value.length) fetchConsultants();

    if (props.value)
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
                : []
        };

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
        user_id: form.value.user_id,
        message: form.value.message,
        status: form.value.status,
        tag_ids: form.value.tags,
        observer_ids: form.value.observers
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

const selectRange = range => {
    form.value.date.end = dayjs().add(range, 'day').toDate();
};

const isEditing = computed(() => isNotNullish(props.value?.id));

onUnmounted(() => {
    destroyPopup();
});
</script>
