<template>
    <div class="switch">
        <span v-if="falseTitle" class="switch__label switch__label--false">{{ falseTitle }}</span>
        <label v-tippy="label" class="switch__wrapper" :class="{ disabled: disabled }">
            <input
                v-model="modelValue"
                @change="$emit('change', modelValue, $event)"
                :disabled="disabled"
                class="switch__input"
                type="checkbox"
                :checked="checked"
            />
            <span class="switch__circle"></span>
        </label>
        <span v-if="trueTitle" class="switch__label switch__label--true">{{ trueTitle }}</span>
    </div>
</template>
<script setup>
defineEmits(['change']);
defineProps({
    disabled: { type: Boolean, default: false },
    trueTitle: { type: String, default: null },
    falseTitle: { type: String, default: null },
    label: { type: String, default: null },
    checked: { type: [Number, Boolean], default: false }
});

const modelValue = defineModel();
</script>
