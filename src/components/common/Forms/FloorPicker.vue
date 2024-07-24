<template>
    <div class="floor-picker">
        <p class="floor-picker__label">Этажи</p>
        <div class="floor-picker__list">
            <button
                v-for="(floor, key) in floorBuildingOptions"
                :key="key"
                @click.prevent="select(key)"
                class="floor-picker__button"
                :class="{ active: cache[key] }"
                :disabled="disabled"
            >
                {{ floor }}
            </button>
            <Button @click="clean" small info class="w-100" :disabled="!modelValue.length">
                Очистить
            </Button>
        </div>
    </div>
</template>
<script setup>
import { floorBuildingOptions } from '@/const/options/floor.options.js';
import { computed } from 'vue';
import Button from '@/components/common/Button.vue';

const modelValue = defineModel({ type: Array, required: true });
defineProps({
    disabled: {
        type: Boolean,
        default: false
    }
});

const cache = computed(() => {
    return modelValue.value.reduce((acc, element) => {
        acc[element] = true;
        return acc;
    }, {});
});
const select = key => {
    if (cache.value[key]) {
        const index = modelValue.value.findIndex(element => element == key);
        if (index !== -1) modelValue.value.splice(index, 1);
    } else {
        modelValue.value.push(key);
    }
};

const clean = () => {
    modelValue.value = [];
};
</script>
