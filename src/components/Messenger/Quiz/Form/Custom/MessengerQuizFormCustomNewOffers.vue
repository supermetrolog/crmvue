<template>
    <div>
        <div class="d-flex gap-1">
            <UiButton @click="addOffer" small color="white" icon="fa-solid fa-plus">
                Добавить предложение
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
            <p class="my-1 text-grey">Предложения ({{ modelValue.length }}):</p>
            <div class="d-flex flex-wrap gap-1">
                <SurveyCardNewOffer
                    v-for="offer in modelValue"
                    :key="offer.id"
                    @edit="editOffer(offer)"
                    @delete="deleteOffer(offer)"
                    :offer="offer"
                    editable
                />
            </div>
        </template>
        <UiModal v-model:visible="formIsVisible" @closed="clearForm" title="Новое предложение">
            <UiForm>
                <RadioOptions
                    v-model="form.dealType"
                    label="Тип предложения"
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
                    label="Описание предложения"
                />
            </UiForm>
            <template #actions="{ close }">
                <UiButton
                    @click="createOrUpdateOffer"
                    color="success-light"
                    bolder
                    small
                    icon="fa-solid fa-check"
                >
                    Сохранить
                </UiButton>
                <UiButton @click="close" color="light" bolder small icon="fa-solid fa-ban">
                    Отмена
                </UiButton>
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
import SurveyCardNewOffer from '@/components/SurveyCard/SurveyCardNewOffer.vue';
import { spliceById } from '@/utils/helpers/array/spliceById.js';

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
const editOfferId = ref(null);

function clearForm() {
    form.dealType = null;
    form.description = null;
    editMode.value = false;
    editOfferId.value = null;
    v$.value.$reset();
}

const dealTypeOptions = {
    1: 'Аренда',
    2: 'Продажа',
    3: 'Ответ-хранение',
    4: 'Субаренда'
};

function addOffer() {
    formIsVisible.value = true;
}

const v$ = useVuelidate(
    {
        form: {
            dealType: {
                required: helpers.withMessage('Выберите тип предложения', required)
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

function createOrUpdateOffer() {
    if (editMode.value) updateOffer();
    else createOffer();
}

function createOffer() {
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

function updateOffer() {
    const updatedIndex = modelValue.value.findIndex(element => element.id === editOfferId.value);
    if (updatedIndex !== -1) {
        modelValue.value[updatedIndex].deal_type = form.dealType;
        modelValue.value[updatedIndex].description = form.description;
    }

    clearForm();
    closeForm();
}

function editOffer(offer) {
    editMode.value = true;
    editOfferId.value = offer.id;

    form.dealType = offer.deal_type;
    form.description = offer.description;

    formIsVisible.value = true;
}

function deleteOffer(offer) {
    spliceById(modelValue.value, offer.id);
}
</script>
