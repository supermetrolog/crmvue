<template>
    <div class="form__control propogation-input">
        <span class="form__label">{{ label }}</span>
        <div v-for="(item, index) in fields" :key="index" class="form__control">
            <label
                @mouseenter="isDeleteShowList[index] = true"
                @mouseleave="isDeleteShowList[index] = false"
                class="form__label form__label--row"
                :class="{ required: required }"
            >
                <AnimationTransition>
                    <i
                        v-show="isDeleteShowList[index]"
                        @click="deleteInput(index)"
                        class="form__close fas fa-xmark-circle"
                    ></i>
                </AnimationTransition>
                <UiPhoneInputCode v-model="fields[index].code" />
                <input
                    ref="inputs"
                    v-model="fields[index][firstName]"
                    v-maska="maskaByCode[fields[index].code]"
                    @input.stop.prevent="onInput"
                    @keypress.enter.prevent
                    type="text"
                    class="form__input"
                    :class="{
                        invalid: isInvalid(index),
                        valid: !isInvalid(index)
                    }"
                    :placeholder="placeholderByCode[fields[index].code]"
                />
                <input
                    v-model="fields[index][secondName]"
                    @input.stop.prevent="onInput"
                    @keypress.enter.prevent
                    type="text"
                    :class="{
                        invalid: isInvalid(index),
                        valid: !isInvalid(index)
                    }"
                    class="form__input form__input--additional"
                    :title="secondTitle"
                />
            </label>
            <ValidationMessage v-if="errors[index].length" :message="errors[index][0]" />
        </div>
        <ValidationMessage
            v-if="hasValidationError && !disabled"
            :message="v.$errors[0].$message"
        />
        <Button @click="addInput"
:disabled="hasEmptyInput"
prevent
icon
small
success
class="mt-1">
            <i class="fas fa-plus"></i>
            {{ addText }}
        </Button>
    </div>
</template>

<script setup>
import Button from '@/components/common/Button.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import ValidationMessage from '@/components/common/Forms/VaildationMessage.vue';
import { useFormControlValidation } from '@/composables/useFormControlValidation.js';
import { computed, nextTick, onBeforeMount, ref, toRef } from 'vue';
import UiPhoneInputCode from '@/components/common/Forms/UiPhoneInputCode.vue';
import { vMaska } from 'maska/vue';

const modelValue = defineModel({
    type: Array,
    default: () => []
});

const props = defineProps({
    required: {
        type: Boolean,
        default: false
    },
    v: {
        type: Object,
        default: null
    },
    label: {
        type: String,
        default: null
    },
    maska: {
        default: null
    },
    placeholder: {
        type: String
    },
    firstName: {
        type: String,
        default: 'phone'
    },
    secondName: {
        type: String,
        default: 'exten'
    },
    secondTitle: {
        type: String,
        default: 'Добавочный номер'
    },
    addText: {
        type: String,
        default: 'Добавить поле'
    },
    validators: {
        type: Array,
        default: () => []
    },
    disabled: {
        type: [Boolean, Number],
        default: false
    },
    reactive: {
        type: [Boolean, Number],
        default: false
    }
});

const createDefaultField = () => ({ [props.firstName]: '', [props.secondName]: null, code: 'ru' });

const isDeleteShowList = ref([false]);
const inputs = ref([]);
const fields = ref([]);

const hasEmptyInput = computed(() => fields.value.some(item => item[props.firstName].length === 0));
const errors = computed(() => {
    return fields.value.map(field => {
        return props.validators.reduce(
            (acc, validator) =>
                !validator.func(field[props.firstName]) && field[props.firstName].length
                    ? [...acc, validator.message]
                    : acc,
            []
        );
    });
});

const { hasValidationError, validate } = useFormControlValidation(toRef(props, 'v'), modelValue, {
    reactive: props.reactive
});

const fieldIsEmpty = fieldIndex => {
    return fields.value[fieldIndex][props.firstName].length === 0;
};

const onInput = () => {
    if (fieldIsEmpty(fields.value.length - 1)) modelValue.value = fields.value.toSpliced(-1, 1);
    else modelValue.value = [...fields.value];

    validate();
};

const deleteInput = index => {
    if (fields.value.length === 1) return;
    fields.value.splice(index, 1);

    if (fieldIsEmpty(fields.value.length - 1)) modelValue.value = fields.value.toSpliced(-1, 1);
    else modelValue.value = [...fields.value];
};

const addInput = () => {
    if (!hasEmptyInput.value) {
        fields.value.push(createDefaultField());
        nextTick(() => {
            inputs.value[fields.value.length - 1].focus();
        });
    }
};

const isInvalid = index =>
    errors.value[index].length && fields.value[index][props.firstName].length;

onBeforeMount(() => {
    if (!modelValue.value.length) fields.value = [createDefaultField()];
    else fields.value = [...modelValue.value];
});

const placeholderByCode = {
    ru: '+7 (___) ___-__-__',
    kz: '+7 (___) ___-__-__',
    ua: '+380 (__) ___-__-__',
    by: '+375 (__) ___-__-__'
};

const maskaByCode = {
    ru: '+7 (###) ###-##-##',
    kz: '+7 (###) ###-##-##',
    ua: '+380 (##) ###-##-##',
    by: '+375 (##) ###-##-##'
};

// code

const COUNTRY_CODES = {
    RU: 'ru',
    KZ: 'kz',
    UA: 'ua',
    BY: 'by'
};

const currentCode = ref(COUNTRY_CODES.RU);
</script>
