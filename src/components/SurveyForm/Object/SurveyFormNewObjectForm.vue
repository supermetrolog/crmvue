<template>
    <UiModal
        @close="$emit('close')"
        show
        custom-close
        :width="900"
        :title="isEditMode ? 'Редактирование нового объекта' : 'Новый объект'"
        :close-on-outside-click="false"
        :close-on-press-esc="false"
    >
        <UiForm>
            <UiFormGroup>
                <div class="col-12">
                    <span class="form__subtitle">Тип объекта</span>
                    <div class="form__row mt-1">
                        <RadioChip v-model="form.is_land" label="Строение" :value="0" />
                        <RadioChip v-model="form.is_land" label="Участок" :value="1" />
                    </div>
                </div>
            </UiFormGroup>
            <UiFormDivider />
            <UiFormGroup>
                <UiInput
                    v-model="form.area"
                    :v="v$.area"
                    label="Площадь"
                    unit="м<sup>2"
                    class="col-6"
                    required
                />
                <MultiSelect
                    v-model="form.class"
                    :disabled="form.is_land"
                    label="Класс объекта"
                    class="col-6"
                    :options="objectOptions.class"
                />
                <AddressAutocomplete
                    v-model="form.address"
                    :v="v$.address"
                    required
                    class="col-12"
                />
            </UiFormGroup>
            <UiFormDivider />
            <UiFormGroup>
                <VueEditor
                    v-model="form.description"
                    :v="v$.description"
                    label="Опишите параметры, характеристики и имеющиеся предложения"
                    class="mt-2 col-12"
                    :toolbar="false"
                    :min-height="80"
                    :debounce="200"
                    required
                />
            </UiFormGroup>
        </UiForm>
        <template #actions="{ close }">
            <UiButton @click="submit" color="success-light" icon="fa-solid fa-check">
                Добавить
            </UiButton>
            <UiButton @click="close" color="light" icon="fa-solid fa-ban">Отмена</UiButton>
        </template>
    </UiModal>
</template>
<script setup>
import { reactive } from 'vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import { useFormData } from '@/utils/use/useFormData.js';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import { objectOptions } from '@/const/options/object.options.js';
import { useValidation } from '@/composables/useValidation.js';
import { helpers, required } from '@vuelidate/validators';
import AddressAutocomplete from '@/components/common/Forms/AddressAutocomplete.vue';

const emit = defineEmits(['updated', 'created', 'close']);

const props = defineProps({
    formData: Object
});

const { isEditMode, form } = useFormData(
    reactive({
        is_land: 0,
        description: null,
        area: null,
        class: null,
        address: null
    }),
    props.formData
);

const { v$, validate } = useValidation(
    {
        area: {
            required: helpers.withMessage('Укажите площадь', required)
        },
        address: {
            required: helpers.withMessage('Укажите адрес', required)
        },
        description: {
            required: helpers.withMessage('Заполните описание', required)
        }
    },
    form
);

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    if (isEditMode.value) emit('updated', form);
    else emit('created', form);
}
</script>
