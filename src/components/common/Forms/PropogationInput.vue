<template>
    <div class="form__group propogation-input">
        <span class="form__label">{{ label }}</span>
        <div v-for="(item, index) in modelValue" :key="index" class="form__control">
            <label
                @mouseenter="isDeleteShowList[index] = true"
                @mouseleave="isDeleteShowList[index] = false"
                class="form__label"
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
                    v-model="modelValue[index][propertyName]"
                    v-maska="maska"
                    @input.stop.prevent="onInput"
                    @keypress.enter.prevent
                    type="text"
                    class="form__input"
                    :required="required"
                    :placeholder="placeholder"
                    :class="{
                        invalid: isInvalid(index),
                        valid: !isInvalid(index)
                    }"
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
import { computed, nextTick, onBeforeMount, ref, toRef } from 'vue';
import { useFormControlValidation } from '@/composables/useFormControlValidation.js';

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
    propertyName: {
        type: String,
        required: true
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

const createDefaultField = () => {
    return { [props.propertyName]: '' };
};

const modelValue = defineModel({
    type: Array
});

const isDeleteShowList = ref([false]);
const inputs = ref([]);

const hasEmptyInput = computed(() =>
    modelValue.value.some(item => !item[props.propertyName].length)
);
const errors = computed(() => {
    return modelValue.value.map(field => {
        return props.validators.reduce(
            (acc, validator) =>
                !validator.func(field[props.propertyName]) && field[props.propertyName].length
                    ? [...acc, validator.message]
                    : acc,
            []
        );
    });
});

const { hasValidationError, validate } = useFormControlValidation(toRef(props, 'v'), modelValue, {
    reactive: props.reactive
});

const onInput = () => {
    validate();
};

const deleteInput = index => {
    if (modelValue.value.length === 1) return;
    modelValue.value = modelValue.value.filter((_, idx) => idx !== Number(index));
};

const addInput = () => {
    if (!hasEmptyInput.value) {
        modelValue.value.push(createDefaultField());
        nextTick(() => {
            inputs.value[modelValue.value.length - 1].focus();
        });
    }
};

const isInvalid = index =>
    errors.value[index].length && modelValue.value[index][props.propertyName].length;

onBeforeMount(() => {
    if (!modelValue.value.length) modelValue.value = [createDefaultField()];
});
</script>
