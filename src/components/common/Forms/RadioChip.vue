<template>
    <label
        class="form__radio-chip radio-chip"
        :class="{
            active: isActive,
            'radio-chip--show-radio': showRadio,
            'radio-chip--rounded': rounded
        }"
    >
        <input
            v-model="field"
            @click="onChange"
            :disabled="disabled"
            type="radio"
            class="radio-chip__input"
            :value="value"
        />
        <slot>{{ label }}</slot>
    </label>
</template>

<script setup>
import { computed, ref } from 'vue';

const emit = defineEmits(['change']);
const modelValue = defineModel();
const props = defineProps({
    required: Boolean,
    label: String,
    value: {
        type: [String, Number, Boolean, null],
        default: null
    },
    unselect: Boolean,
    disabled: Boolean,
    showRadio: Boolean,
    rounded: {
        type: Boolean,
        default: true
    }
});

const field = ref(modelValue);

const isActive = computed(() => modelValue.value == props.value);

const onChange = () => {
    if (props.unselect && props.value == field.value) modelValue.value = null;
    else modelValue.value = props.value;
    emit('change', modelValue.value);
};
</script>
