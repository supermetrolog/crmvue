<template>
    <div class="form__control">
        <div class="form__label" :class="{ required: required }">
            <span v-if="label">{{ label }}</span>
            <div
                tabindex="0"
                class="form__stars text-warning"
                :class="{
                    danger: currentPercent < 40,
                    normal: currentPercent >= 40 && currentPercent < 75,
                    good: currentPercent >= 75
                }"
            >
                <button
                    v-for="key in max"
                    :key="key"
                    @click.prevent="onChange(key)"
                    tabindex="-1"
                    class="form__star"
                >
                    <i class="fa-star" :class="key <= modelValue ? 'fa-solid' : 'fa-regular'" />
                </button>
            </div>
        </div>
        <div v-if="v && v.$error" class="error-container">
            <p>{{ v.$errors[0].$message }}</p>
        </div>
        <slot />
    </div>
</template>

<script setup>
import { computed } from 'vue';

const modelValue = defineModel({ type: Number, default: null });
const props = defineProps({
    required: Boolean,
    v: {
        type: Object,
        default: null
    },
    label: {
        type: String,
        default: null
    },
    max: {
        type: Number,
        default: 5
    }
});

const validate = () => {
    if (props.v) props.v.$touch();
};

const currentPercent = computed(() => (modelValue.value / props.max) * 100);

const onChange = value => {
    if (value > props.max) return;

    validate();
    modelValue.value = value;
};
</script>
