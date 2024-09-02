<template>
    <Modal
        @close="close"
        :show="isVisible"
        width="1200"
        :title="props ? 'Редактирование напоминания' : 'Создание напоминания'"
    >
        <Stepper @complete="submit" :steps="steps" :v="v$.form" keep-alive>
            <template #1>
                <Spinner v-if="isLoading" center />
                <UserPicker v-else v-model="form.user_id" single :users="consultants" />
            </template>
            <template #2>
                <DatePicker v-model="form.notify_at" size="70px" class="mx-auto" />
            </template>
            <template #3>
                <Textarea v-model="form.message" label="Описание" />
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
import { onUnmounted, ref, shallowRef } from 'vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';

const store = useStore();

const steps = [
    {
        name: 'user_id',
        title: 'Выбор сотрудников'
    },
    {
        name: 'notify_at',
        title: 'Выбор даты'
    },
    {
        name: 'message',
        title: 'Дополнительное описание'
    }
];

const consultants = ref([]);
const isLoading = shallowRef(false);
const form = ref({
    message: null,
    notify_at: null,
    user_id: null,
    status: 1
});

const clearForm = () => {
    form.value = {
        message: null,
        notify_at: null,
        user_id: null,
        status: 1
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
} = useAsyncPopup('reminderCreator');

onPopupShowed(() => {
    if (!consultants.value.length) fetchConsultants();

    if (props.value)
        form.value = {
            message: props.value.message,
            user_id: props.value.user_id,
            notify_at: props.value.notify_at,
            status: props.value.status
        };
});

const v$ = useVuelidate(
    {
        form: {
            notify_at: {
                required: helpers.withMessage('Выберите дату напоминания!', required)
            },
            user_id: {
                minLength: helpers.withMessage('Выберите сотрудника!', required)
            },
            message: {
                required: helpers.withMessage('Укажите сообщение к напоминанию', required)
            }
        }
    },
    { form }
);

const submit = () => {
    _submit(form.value);
};

const close = () => {
    cancel();
    clearForm();
};

onUnmounted(() => {
    destroyPopup();
});
</script>
