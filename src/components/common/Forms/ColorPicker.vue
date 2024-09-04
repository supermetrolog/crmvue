<template>
    <div class="color-picker">
        <span v-if="label" class="color-picker__label">
            {{ label }}
        </span>
        <button
            ref="reference"
            v-tippy="'Нажмите, чтобы выбрать цвет'"
            @click.prevent="pickerIsVisible = !pickerIsVisible"
            class="color-picker__element"
            :class="{ 'color-picker__element--circle': circle }"
            :style="{ backgroundColor: currentColor, width: `${size}px` }"
        ></button>
        <teleport to="body">
            <color-picker
                v-show="pickerIsVisible"
                ref="floating"
                @changeColor="onChange"
                :style="floatingStyles"
                :color="currentColor"
                :colors-default="colors.length ? colors : undefined"
                class="color-picker-popup"
                theme="light"
            />
        </teleport>
    </div>
</template>
<script setup>
import { ColorPicker } from 'vue-color-kit';
import { computed, ref } from 'vue';
import { useFloating } from '@floating-ui/vue';
import { onClickOutside } from '@vueuse/core';

const color = defineModel({ type: String, default: '#000000' });
const props = defineProps({
    size: { type: Number, default: 40 },
    circle: { type: Boolean, default: false },
    label: { type: String, default: null },
    colors: { type: Array, default: () => [] },
    withoutHashtag: { type: Boolean, default: false }
});

const reference = ref(null);
const floating = ref(null);
const pickerIsVisible = ref(false);

const closePicker = () => (pickerIsVisible.value = false);

const { floatingStyles } = useFloating(reference, floating);
onClickOutside(floating, closePicker, { ignore: [reference] });

const onChange = event => {
    if (props.withoutHashtag) color.value = event.hex.slice('1');
    else color.value = event.hex;
};

const currentColor = computed(() => {
    if (props.withoutHashtag) return '#' + color.value;
    return color.value;
});
</script>
