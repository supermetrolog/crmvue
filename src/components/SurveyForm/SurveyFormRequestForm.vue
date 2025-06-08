<template>
    <UiModal
        @close="$emit('close')"
        custom-close
        show
        :title="isEditMode ? 'Редактирование нового запроса' : 'Новый запрос'"
    >
        <UiForm>
            <UiFormGroup>
                <RadioOptions
                    v-model="form.deal_type"
                    label="Тип запроса"
                    :options="dealTypeOptions"
                    :rounded="false"
                    required
                    show-radio
                    class="col-12"
                    :v="v$.form.deal_type"
                />
                <UiCheckbox
                    v-model="form.express"
                    :true-value="1"
                    :false-value="null"
                    class="col-12"
                >
                    Срочный запрос
                </UiCheckbox>
            </UiFormGroup>
            <UiFormDivider />
            <UiFormGroup>
                <DoubleInput
                    v-model:first="form.area_min"
                    v-model:second="form.area_max"
                    label="Площадь"
                    class="col-12"
                    type="number"
                    unit="м<sup>2</sup>"
                    reactive
                />
            </UiFormGroup>
            <UiFormDivider />
            <UiFormGroup>
                <UiTextarea
                    v-model="form.location"
                    label="Локация"
                    class="col-12"
                    :min-height="80"
                    auto-height
                    :max-height="140"
                />
            </UiFormGroup>
            <UiFormGroup>
                <VueEditor
                    v-model="form.description"
                    label="Описание запроса"
                    class="col-12"
                    :toolbar="false"
                    :min-height="80"
                />
            </UiFormGroup>
        </UiForm>
        <template #actions="{ close }">
            <UiButton @click="submit" color="success-light" icon="fa-solid fa-check">
                Сохранить
            </UiButton>
            <UiButton @click="close" color="light" icon="fa-solid fa-ban">Отмена</UiButton>
        </template>
    </UiModal>
</template>
<script setup>
import { reactive } from 'vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import { useFormData } from '@/utils/use/useFormData.js';
import { useValidation } from '@/composables/useValidation.js';
import { helpers, required } from '@vuelidate/validators';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiCheckbox from '@/components/common/Forms/UiCheckbox.vue';
import DoubleInput from '@/components/common/Forms/DoubleInput.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';

const emit = defineEmits(['close', 'updated', 'created']);

const props = defineProps({
    formData: Object
});

const { form, isEditMode } = useFormData(
    reactive({
        deal_type: null,
        description: null,
        location: null,
        area_min: null,
        area_max: null,
        express: null
    }),
    props.formData
);

const { v$, validate } = useValidation(
    {
        form: {
            deal_type: {
                required: helpers.withMessage('Выберите тип запроса', required)
            }
        }
    },
    { form }
);

const dealTypeOptions = {
    1: 'Аренда',
    2: 'Продажа',
    3: 'Ответ-хранение',
    4: 'Субаренда',
    5: 'Строительство'
};

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    if (isEditMode.value) emit('updated', form);
    else emit('created', form);
}
</script>
