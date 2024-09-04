<template>
    <Modal
        @close="close"
        :show="isVisible"
        width="1200"
        :title="props ? 'Редактирование задачи' : 'Создание задачи'"
    >
        <Stepper @complete="submit" :steps="steps" :v="v$.form" keep-alive>
            <template #1>
                <Spinner v-if="isLoading" center />
                <UserPicker v-else v-model="form.user_id" single :users="consultants" />
            </template>
            <template #2>
                <DatePicker v-model="form.date.end" size="70px" class="mx-auto" />
            </template>
            <template #3>
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
                <Textarea v-model="form.message" class="col-12" label="Описание задачи" />
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
import { helpers, required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import Textarea from '@/components/common/Forms/Textarea.vue';
import { useStore } from 'vuex';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import TaskTagOption from '@/components/common/Forms/TaskTagOption.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import { computed, onUnmounted, ref, shallowRef } from 'vue';

const store = useStore();

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

const consultants = ref([]);
const isLoading = shallowRef(false);
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

const tagsOptions = computed(() => store.getters['Task/tagsOptions']);

const consultantsForObservers = computed(() => {
    return consultants.value.filter(element => element.id !== form.value.user_id);
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

const getTagsOptions = async () => {
    if (tagsOptions.value.length) return tagsOptions.value;
    await store.dispatch('Task/fetchTags');
    return tagsOptions.value;
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
    if (!consultants.value.length) fetchConsultants();

    console.log(props.value.observers);

    if (props.value)
        form.value = {
            message: props.value.message,
            date: {
                end: props.value.end,
                start: props.value.start
            },
            user_id: props.value.user_id,
            status: props.value.status ?? 1,
            tags: props.value.tags ? props.value.tags.map(element => element.id) : [],
            observers: props.value.observers
                ? props.value.observers.map(element => element.user_id)
                : []
        };
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
                required: helpers.withMessage('Описание задачи является обязательным!', required)
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

onUnmounted(() => {
    destroyPopup();
});
</script>
