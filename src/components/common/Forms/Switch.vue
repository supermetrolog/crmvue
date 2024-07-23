<template>
    <div class="switch">
        <button
            v-if="falseTitle"
            @click.prevent="field = false"
            class="switch__label switch__label--false"
        >
            {{ falseTitle }}
        </button>
        <label v-tippy="label" class="switch__wrapper" :class="{ disabled: disabled }">
            <input
                v-model="field"
                @change="$emit('change', modelValue, $event)"
                :disabled="disabled"
                class="switch__input"
                type="checkbox"
                :checked="Boolean(checked)"
            />
            <span class="switch__circle"></span>
        </label>
        <button
            v-if="trueTitle"
            @click.prevent="field = true"
            class="switch__label switch__label--true"
        >
            {{ trueTitle }}
        </button>
    </div>
</template>
<script setup>
import { computed } from 'vue';

defineEmits(['change']);
const props = defineProps({
    disabled: { type: Boolean, default: false },
    trueTitle: { type: String, default: null },
    falseTitle: { type: String, default: null },
    label: { type: String, default: null },
    checked: { type: [Number, Boolean], default: false },
    transform: { type: Function, default: Boolean },
    onlyTrue: { type: Boolean, default: false }
});

const modelValue = defineModel();

const field = computed({
    get() {
        return Boolean(modelValue.value);
    },
    set(value) {
        if (props.onlyTrue && !value) {
            modelValue.value = null;
            return null;
        }

        modelValue.value = props.transform(value);
        return value;
    }
});
</script>
