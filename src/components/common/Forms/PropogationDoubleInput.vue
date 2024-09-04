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
                <input
                    ref="inputs"
                    v-model="fields[index][firstName]"
                    v-maska="maska"
                    @input.stop.prevent="onInput"
                    @keypress.enter.prevent
                    type="text"
                    class="form__input"
                    :class="{
                        invalid: isInvalid(index),
                        valid: !isInvalid(index)
                    }"
                    :placeholder="placeholder"
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
        <Button @click="addInput" :disabled="hasEmptyInput" prevent icon small success class="mt-1">
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

const createDefaultField = () => ({ [props.firstName]: '', [props.secondName]: null });

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
</script>
