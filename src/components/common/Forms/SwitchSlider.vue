<template>
    <div class="switch-slider" :class="{ disabled: disabled }">
        <div class="switch-slider__wrapper">
            <span v-if="label" class="switch-slider__label">{{ label }}</span>
            <div class="switch-slider__buttons">
                <button
                    @click.prevent="select(trueValue)"
                    :class="{ active: modelValue == trueValue }"
                    :disabled="disabled"
                    class="switch-slider__button"
                >
                    {{ trueTitle }}
                </button>
                <button
                    @click.prevent="select(null)"
                    :class="{ active: modelValue === null }"
                    :disabled="disabled"
                    class="switch-slider__button switch-slider__button--unknown"
                >
                    {{ unknownTitle }}
                </button>
                <button
                    @click.prevent="select(falseValue)"
                    :class="{ active: modelValue == falseValue }"
                    :disabled="disabled"
                    class="switch-slider__button"
                >
                    {{ falseTitle }}
                </button>
            </div>
            <slot />
        </div>
    </div>
</template>
<script setup>
const emit = defineEmits(['change']);
defineProps({
    disabled: { type: Boolean, default: false },
    trueTitle: { type: String, default: 'Да' },
    trueValue: { type: [Number, Boolean], default: 1 },
    falseTitle: { type: String, default: 'Нет' },
    falseValue: { type: [Number, Boolean], default: 0 },
    unknownTitle: { type: String, default: 'Неважно' },
    label: { type: String, default: undefined }
});

const modelValue = defineModel();

const select = value => {
    if (value === modelValue.value) modelValue.value = null;
    else modelValue.value = value;

    emit('change');
};
</script>
