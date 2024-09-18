<template>
    <Form @submit="onSubmit">
        <Loader v-if="isLoading" />
        <FormGroup>
            <MultiSelect
                v-model="form.passive_why"
                :v="v$.form.passive_why"
                required
                label="Причина"
                class="col-12"
                :options="PassiveWhyRequest"
            />
            <Textarea
                v-model="form.passive_why_comment"
                :v="v$.form.passive_why_comment"
                required
                label="Комментарий"
                class="col-12 mt-1"
            />
            <div class="col-12 mt-1">
                <Submit class="w-100 btn-danger">Завершить</Submit>
            </div>
        </FormGroup>
    </Form>
</template>

<script setup>
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import Submit from '@/components/common/Forms/FormSubmit.vue';
import useVuelidate from '@vuelidate/core';
import { PassiveWhyRequest } from '@/const/const.js';
import { helpers, required } from '@vuelidate/validators';
import api from '@//api/api.js';
import Loader from '@/components/common/Loader.vue';
import { reactive, shallowRef } from 'vue';

const emit = defineEmits(['disabled']);
const props = defineProps({
    request_id: {
        type: Number,
        required: true
    }
});

const isLoading = shallowRef(false);
const form = reactive({
    passive_why: null,
    passive_why_comment: null
});

const v$ = useVuelidate(
    {
        form: {
            passive_why: {
                required: helpers.withMessage('Выберите причину', required)
            },
            passive_why_comment: {
                required: helpers.withMessage('Укажите комментарий', required)
            }
        }
    },
    { form }
);

const onSubmit = async () => {
    v$.value.$validate();
    if (v$.value.form.$error) return;

    isLoading.value = true;

    const disabled = await api.request.disable(props.request_id, form);
    if (disabled) emit('disabled', form);

    isLoading.value = false;
};
</script>
