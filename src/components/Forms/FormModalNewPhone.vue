<template>
    <UiModal
        @closed="emit('close')"
        :width="600"
        :title="isEditMode ? `Редактирование номера` : 'Добавление номера'"
        show
    >
        <UiForm>
            <UiFormGroup>
                <UiPhoneInput
                    v-model:phone="form.phone"
                    v-model:country-code="form.country_code"
                    :v="v$.form.phone"
                    label="Номер телефона"
                    class="col-6"
                    required
                />
                <UiInput
                    v-model="form.exten"
                    label="Добавочный"
                    input-type="number"
                    class="col-4"
                />
                <UiCol :cols="2">
                    <span class="form__subtitle">Осн.</span>
                    <CheckboxChip
                        ref="isMainCheckbox"
                        v-model="form.isMain"
                        title="Основной номер"
                        icon="fa-solid fa-user-check"
                    />
                </UiCol>
            </UiFormGroup>
            <UiFormDivider />
            <UiFormGroup>
                <MultiSelect
                    v-model="form.type"
                    label="Тип телефона"
                    class="col-12"
                    :options="PhoneTypeLabel"
                    placeholder="Укажите тип.."
                />
            </UiFormGroup>
            <UiFormDivider />
            <UiFormGroup>
                <UiTextarea
                    v-model="form.comment"
                    label="Комментарий"
                    placeholder="Дополнительные сведения о номере, если необходимо.."
                    auto-height
                    :min-height="60"
                    :max-height="200"
                    class="col-12"
                />
            </UiFormGroup>
        </UiForm>
        <template #actions="{ close }">
            <UiButton @click="submit" color="success-light" icon="fa-solid fa-check">
                Сохранить
            </UiButton>
            <UiButton @click="close" color="light" icon="fa-solid fa-close">Отмена</UiButton>
            <UiButton
                v-if="isEditMode"
                @click="$emit('delete', formData)"
                color="light"
                icon="fa-solid fa-trash"
            >
                Удалить
            </UiButton>
        </template>
    </UiModal>
</template>
<script setup lang="ts">
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import { reactive, useTemplateRef } from 'vue';
import { useFormData } from '@/utils/use/useFormData.js';
import { useValidation } from '@/composables/useValidation.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiPhoneInput from '@/components/common/Forms/UiPhoneInput.vue';
import { Phone, PhoneCountryCodeEnum, PhoneTypeEnum, PhoneTypeLabel } from '@/types/contact/phone';
import UiInput from '@/components/common/Forms/UiInput.vue';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import { useTippy } from 'vue-tippy';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import dayjs from 'dayjs';
import { helpers, required } from '@vuelidate/validators';

const emit = defineEmits<{
    (e: 'created', phone: Phone): void;
    (e: 'updated', phoneId: number, phone: Phone): void;
    (e: 'delete', phone: Phone): void;
}>();

const props = defineProps<{ formData: Phone }>();

const { form, isEditMode } = useFormData(
    reactive<Phone>({
        id: dayjs().unix(),
        phone: '',
        country_code: PhoneCountryCodeEnum.RU,
        type: PhoneTypeEnum.MOBILE,
        comment: null,
        exten: null,
        isMain: null
    }),
    props.formData
);

const phonesLengthByCode = {
    [PhoneCountryCodeEnum.RU]: 11,
    [PhoneCountryCodeEnum.UA]: 12,
    [PhoneCountryCodeEnum.BY]: 12
};

function validatePhone(phone) {
    return phone?.length === phonesLengthByCode[form.country_code];
}

const { v$, validate } = useValidation(
    {
        form: {
            phone: {
                required: helpers.withMessage('Укажите номер телефона', required),
                length: helpers.withMessage('Заполните номера телефона', validatePhone)
            }
        }
    },
    { form }
);

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    if (isEditMode.value) emit('updated', props.formData.id, form);
    else emit('created', form);
}

useTippy(useTemplateRef('isMainCheckbox'), { content: 'Отметить, как основной номер' });
</script>
