<template>
    <Modal
        @close="close"
        :show="isVisible"
        width="1200"
        :title="props ? 'Редактирование уведомления' : 'Создание уведомления'"
    >
        <Stepper @complete="submit" :steps="steps" :v="v$.form" keep-alive>
            <template #1>
                <Spinner v-if="isLoading" center />
                <UserPicker v-else v-model="form.user_id" single :users="consultants" />
            </template>
            <template #2>
                <UiInput
                    v-model="form.description.subject"
                    class="mb-2"
                    type="text"
                    label="Заголовок"
                    required
                />
                <UiTextarea v-model="form.description.message" label="Описание" required />
            </template>
        </Stepper>
    </Modal>
</template>
<script setup>
import Spinner from '@/components/common/Spinner.vue';
import Modal from '@/components/common/Modal.vue';
import UserPicker from '@/components/common/Forms/UserPicker/UserPicker.vue';
import Stepper from '@/components/common/Stepper/Stepper.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import UiInput from '@/components/common/Forms/UiInput.vue';
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
        name: 'description',
        title: 'Дополнительное сообщение'
    }
];

const consultants = ref([]);
const isLoading = shallowRef(false);
const form = ref({
    user_id: null,
    description: {
        message: null,
        subject: null
    }
});

const clearForm = () => {
    form.value = {
        user_id: null,
        description: {
            message: null,
            subject: null
        }
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
} = useAsyncPopup('alertCreator');

onPopupShowed(() => {
    if (!consultants.value.length) fetchConsultants();

    if (props.value)
        form.value = {
            user_id: props.value.user_id,
            description: {
                message: props.value.message,
                subject: props.value.subject
            }
        };
});

const v$ = useVuelidate(
    {
        form: {
            user_id: {
                required: helpers.withMessage('Выберите сотрудника!', required)
            },
            description: {
                message: {
                    required: helpers.withMessage('Укажите заголовок уведомления', required)
                },
                subject: {
                    required: helpers.withMessage('Укажите небольшое описание', required)
                }
            }
        }
    },
    { form }
);

const formToPayload = () => {
    return {
        user_id: form.value.user_id,
        message: form.value.description.message,
        subject: form.value.description.subject
    };
};

const submit = () => {
    _submit(formToPayload());
};

const close = () => {
    cancel();
    clearForm();
};

onUnmounted(() => {
    destroyPopup();
});
</script>
