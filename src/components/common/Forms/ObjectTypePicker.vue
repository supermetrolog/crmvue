<template>
    <div class="object-type-picker">
        <div class="object-type-picker__wrapper">
            <button
                @click.prevent="toggleDisabled"
                class="object-type-picker__extra"
                :class="{ active: !disabled, invalid: hasValidationError }"
            >
                {{ label }}
            </button>
            <div class="object-type-picker__list">
                <button
                    v-for="(option, key) in options"
                    :key="key"
                    v-tippy="option.name"
                    @click.prevent="select(Number(key))"
                    class="object-type-picker__button"
                    :class="{
                        active: cache[key]
                    }"
                    :disabled="disabled"
                >
                    <i :class="option.icon" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const modelValue = defineModel('value');
const extraModelValue = defineModel('extra');

const props = defineProps({
    label: {
        type: String,
        required: true
    },
    options: {
        type: Object,
        required: true
    },
    extraValue: {
        type: Number,
        required: true
    },
    v: {
        type: Object,
        default: null
    }
});

const disabled = computed(() => {
    if (!extraModelValue.value) return false;
    return !extraModelValue.value.includes(props.extraValue);
});
const cache = computed(() => {
    return modelValue.value.reduce((acc, element) => {
        acc[element] = true;
        return acc;
    }, {});
});
const hasValidationError = computed(() => {
    return Boolean(props.v && props.v.$error);
});

const validate = () => {
    if (props.v) props.v.$touch();
};

const select = key => {
    if (cache.value[key]) {
        const keyIndex = modelValue.value.findIndex(element => Number(element) === key);
        if (keyIndex !== -1) modelValue.value.splice(keyIndex, 1);
    } else {
        modelValue.value.push(key);
    }

    validate();
};
const toggleDisabled = () => {
    if (!disabled.value) {
        const extraIndex = extraModelValue.value.findIndex(
            element => Number(element) === props.extraValue
        );
        if (extraIndex !== -1) extraModelValue.value.splice(extraIndex, 1);

        modelValue.value = modelValue.value.filter(element => !props.options[element]);
    } else {
        extraModelValue.value.push(props.extraValue);
    }

    validate();
};
</script>
