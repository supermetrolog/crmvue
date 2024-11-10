<template>
    <label class="form__radio-chip radio-chip" :class="{ active: isActive }">
        <input
            v-model="field"
            @click="onChange"
            :disabled="disabled"
            type="radio"
            class="radio-chip__input"
            :value="value"
        />
        {{ label }}
    </label>
</template>

<script setup>
import { computed, ref } from 'vue';

const emit = defineEmits(['change']);
const modelValue = defineModel();
const props = defineProps({
    required: {
        type: Boolean,
        default: false
    },
    label: {
        type: String,
        default: null
    },
    value: {
        type: [String, Number, Boolean, null],
        default: null
    },
    unselect: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
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
