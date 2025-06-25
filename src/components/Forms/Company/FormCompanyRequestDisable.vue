<template>
    <UiForm @submit="onSubmit">
        <Loader v-if="isLoading" />
        <UiFormGroup>
            <MultiSelect
                v-model="form.passive_why"
                :v="v$.form.passive_why"
                :options="passiveWhyOptions"
                required
                label="Причина"
                class="col-12"
            />
            <UiTextarea
                v-model="form.passive_why_comment"
                :v="v$.form.passive_why_comment"
                :required="passiveWhyCommentIsRequired"
                label="Комментарий"
                class="col-12 mt-1"
            />
        </UiFormGroup>
        <UiFormGroup>
            <UiCol :cols="12">
                <div class="d-flex gap-1">
                    <UiButton color="danger" icon="fa-solid fa-check" bolder>Завершить</UiButton>
                    <UiButton @click="$emit('cancel')" color="light" icon="fa-solid fa-ban" bolder>
                        Отмена
                    </UiButton>
                </div>
            </UiCol>
        </UiFormGroup>
    </UiForm>
</template>

<script setup>
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import { helpers, required, requiredIf } from '@vuelidate/validators';
import api from '@//api/api.js';
import Loader from '@/components/common/Loader.vue';
import { computed, reactive, ref } from 'vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useValidation } from '@/composables/useValidation.js';
import UiCol from '@/components/common/UI/UiCol.vue';
import { RequestPassiveWhyEnum } from '@/types/request.ts';

const emit = defineEmits(['disabled', 'cancel']);
const props = defineProps({
    request_id: {
        type: Number,
        required: true
    }
});

const isLoading = ref(false);

const form = reactive({
    passive_why: null,
    passive_why_comment: null
});

const passiveWhyCommentIsRequired = computed(
    () => form.passive_why === RequestPassiveWhyEnum.OTHER
);

const { v$, validate } = useValidation(
    {
        form: {
            passive_why: {
                required: helpers.withMessage('Выберите причину', required)
            },
            passive_why_comment: {
                required: helpers.withMessage(
                    'Укажите комментарий',
                    requiredIf(passiveWhyCommentIsRequired)
                )
            }
        }
    },
    { form }
);

async function onSubmit() {
    const isValid = await validate();
    if (!isValid) return;

    isLoading.value = true;

    try {
        const disabled = await api.request.disable(props.request_id, form);
        if (disabled) emit('disabled', form);
    } finally {
        isLoading.value = false;
    }
}

const passiveWhyOptions = [
    { value: 1, label: 'Сняли' },
    { value: 2, label: 'Купили' },
    { value: 3, label: 'Запрос устарел' },
    { value: 4, label: 'Отложил поиск' },
    { value: 5, label: 'Иное' }
];
</script>
