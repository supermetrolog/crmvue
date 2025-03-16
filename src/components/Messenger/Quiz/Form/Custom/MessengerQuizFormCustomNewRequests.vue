<template>
    <div>
        <div class="d-flex gap-1">
            <UiButton @click="addRequest" small color="white" icon="fa-solid fa-plus">
                Добавить запрос
            </UiButton>
            <UiButton
                @click="clearModelValue"
                :disabled="!modelValue.length"
                small
                color="white"
                icon="fa-solid fa-xmark"
            >
                Очистить
            </UiButton>
        </div>
        <template v-if="modelValue.length">
            <p class="my-1 text-grey">Запросы ({{ modelValue.length }}):</p>
            <div class="d-flex flex-wrap gap-1">
                <SurveyCardNewRequest
                    v-for="request in modelValue"
                    :key="request.id"
                    @edit="editRequest(request)"
                    @delete="deleteRequest(request)"
                    :request="request"
                    editable
                />
            </div>
        </template>
        <UiModal v-model:visible="formIsVisible" @closed="clearForm" title="Новый запрос">
            <UiForm>
                <RadioOptions
                    v-model="form.dealType"
                    label="Тип запроса"
                    :options="dealTypeOptions"
                    :rounded="false"
                    required
                    show-radio
                    :v="v$.form.dealType"
                />
                <UiTextarea
                    v-model="form.description"
                    class="mt-2"
                    auto-height
                    :min-height="70"
                    :max-height="250"
                    label="Описание запроса"
                />
            </UiForm>
            <template #footer="{ close }">
                <UiButton @click="createOrUpdateRequest" color="success">Сохранить</UiButton>
                <UiButton @click="close" color="danger">Отмена</UiButton>
            </template>
        </UiModal>
    </div>
</template>
<script setup>
import { reactive, ref, watch } from 'vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { useValidationNotify } from '@/composables/useValidationNotify.js';
import { spliceById } from '@/utils/helpers/array/spliceById.js';
import SurveyCardNewRequest from '@/components/SurveyCard/SurveyCardNewRequest.vue';

const modelValue = defineModel({ type: Array, default: () => [] });
const props = defineProps({
    disabled: Boolean,
    hidden: Boolean
});

watch(
    () => props.disabled,
    value => {
        if (value) {
            modelValue.value = [];
        }
    }
);

function clearModelValue() {
    modelValue.value = [];
}

// form

const formIsVisible = ref(false);
const form = reactive({
    dealType: null,
    description: null
});
const editMode = ref(false);
const editRequestId = ref(null);

function clearForm() {
    form.dealType = null;
    form.description = null;
    editMode.value = false;
    editRequestId.value = null;
    v$.value.$reset();
}

const dealTypeOptions = {
    1: 'Аренда',
    2: 'Продажа',
    3: 'Ответ-хранение',
    4: 'Субаренда',
    5: 'Строительство'
};

function addRequest() {
    formIsVisible.value = true;
}

const v$ = useVuelidate(
    {
        form: {
            dealType: {
                required: helpers.withMessage('Выберите тип запроса', required)
            }
        }
    },
    { form }
);

function closeForm() {
    formIsVisible.value = false;
}

const { validateWithNotify } = useValidationNotify(v$);

let localeId = 0;

function createOrUpdateRequest() {
    if (editMode.value) updateRequest();
    else createRequest();
}

function createRequest() {
    const isValid = validateWithNotify();
    if (!isValid) return;

    modelValue.value.push({
        id: localeId,
        deal_type: form.dealType,
        description: form.description
    });

    localeId++;

    clearForm();
    closeForm();
}

function updateRequest() {
    const updatedIndex = modelValue.value.findIndex(element => element.id === editRequestId.value);
    if (updatedIndex !== -1) {
        modelValue.value[updatedIndex].deal_type = form.dealType;
        modelValue.value[updatedIndex].description = form.description;
    }

    clearForm();
    closeForm();
}

function editRequest(request) {
    editMode.value = true;
    editRequestId.value = request.id;

    form.dealType = request.deal_type;
    form.description = request.description;

    formIsVisible.value = true;
}

function deleteRequest(request) {
    spliceById(modelValue.value, request.id);
}
</script>
