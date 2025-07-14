<template>
    <div class="form__control propogation-input">
        <label @click.prevent>
            <span v-if="label" @click="focus" class="form__label">{{ label }}</span>
            <span class="d-flex">
                <UiPhoneInputCode v-model="countryCodeValue" class="mr-1" :disabled />
                <input
                    ref="input"
                    v-model="localePhone"
                    @input.stop.prevent="onInput"
                    @keypress.enter.prevent
                    type="text"
                    class="form__input"
                    :class="[validationClass, { filled: hasValue }]"
                    :placeholder="placeholderByCode[countryCodeValue]"
                    :required
                    :disabled
                />
            </span>
            <slot />
        </label>
        <ValidationInfo v-if="hasValidation && !disabled && !reactive" :validator="v" />
        <ValidationMessage
            v-if="hasValidationError && !disabled"
            :message="v.$errors[0].$message"
        />
    </div>
</template>

<script setup lang="ts">
import ValidationMessage from '@/components/common/Forms/VaildationMessage.vue';
import { useFormControlValidation } from '@/composables/useFormControlValidation.js';
import { computed, onMounted, ref, toRef, useTemplateRef, watch } from 'vue';
import UiPhoneInputCode from '@/components/common/Forms/UiPhoneInputCode.vue';
import ValidationInfo from '@/components/common/Forms/ValidationInfo.vue';
import { isNullish } from '@/utils/helpers/common/isNullish';
import { isString } from '@/utils/helpers/string/isString.js';
import { isNotEmptyString } from '@/utils/helpers/string/isNotEmptyString';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import { PhoneCountryCode, PhoneCountryCodeEnum } from '@/types/contact/phone';
import { useMask } from '@/composables/useMask';

const placeholderByCode = {
    [PhoneCountryCodeEnum.RU]: '+7 (___) ___-__-__',
    [PhoneCountryCodeEnum.UA]: '+380 (__) ___-__-__',
    [PhoneCountryCodeEnum.BY]: '+375 (__) ___-__-__'
};

const maskaByCode = {
    [PhoneCountryCodeEnum.RU]: '+7 (###) ###-##-##',
    [PhoneCountryCodeEnum.UA]: '+380 (##) ###-##-##',
    [PhoneCountryCodeEnum.BY]: '+375 (##) ###-##-##'
};

const beforeCodeByCode = {
    [PhoneCountryCodeEnum.RU]: '7',
    [PhoneCountryCodeEnum.UA]: '380',
    [PhoneCountryCodeEnum.BY]: '375'
};

const phoneValue = defineModel<string>('phone');

const localePhone = ref(phoneValue.value);

const localePhoneValue = computed({
    get: () => {
        if (isNullish(phoneValue.value)) return '';
        return (phoneValue.value as string).slice(beforeCodeByCode[countryCodeValue.value].length);
    },
    set: (value: string | null) => {
        if (isNullish(value) || value?.length === 0) {
            phoneValue.value = '';
            localePhone.value = '';
            return;
        }

        phoneValue.value = beforeCodeByCode[countryCodeValue.value] + value;
    }
});

const countryCodeValue = defineModel<PhoneCountryCode>('country-code', {
    default: PhoneCountryCodeEnum.RU
});

export interface UiPhoneInputProps {
    label?: string;
    v?: object;
    validators?: any[];
    required?: boolean;
    disabled?: boolean;
    reactive?: boolean;
}

const props = defineProps<UiPhoneInputProps>();

const hasValue = computed(() => {
    if (isNullish(phoneValue.value)) return false;

    if (isString(phoneValue.value)) return isNotEmptyString(phoneValue.value);

    return isNotNullish(phoneValue.value);
});

function onInput() {
    validate();
}

watch(countryCodeValue, value => {
    if (isNotNullish(value)) focus();
    localePhoneValue.value = '';
});

const { hasValidation, hasValidationError, validate, validationClass } = useFormControlValidation(
    toRef(props, 'v'),
    phoneValue,
    { reactive: props.reactive }
);

onMounted(() => {
    if (props.reactive) validate();
});

const inputEl = useTemplateRef('input');

function focus() {
    inputEl.value?.focus();
}

// maska

const currentMask = computed(() => {
    return maskaByCode[countryCodeValue.value];
});

// defineExpose({ localePhoneValue });

useMask(
    inputEl,
    toRef(() => ({ mask: currentMask.value })),
    localePhoneValue
);
</script>
