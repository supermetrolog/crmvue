<template>
    <div class="file-picker" :class="{ disabled: disabled }">
        <div class="file-picker__header mb-2">
            <DashboardChip class="dashboard-bg-light">
                Выбрано фотографий: {{ modelValue.length }}
            </DashboardChip>
            <Button @click="clean" danger small :disabled="!modelValue.length || disabled">
                Очистить
            </Button>
            <Button
                @click="selectAll"
                small
                :disabled="Boolean(modelValue.length === photos.length) || disabled"
            >
                Выбрать всё
            </Button>
        </div>
        <div class="file-picker__row row">
            <div v-for="src in photos" :key="src" class="file-picker__element col-2">
                <div class="file-picker__preview" :class="{ active: cache[src] }">
                    <VLazyImage
                        @click="select(src)"
                        class="file-picker__image"
                        :src="getLinkFile(src)"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import VLazyImage from 'v-lazy-image';
import { computed } from 'vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import Button from '@/components/common/Button.vue';
import { getLinkFile } from '@/utils/url.js';

const modelValue = defineModel({ type: Array, required: true });
const props = defineProps({
    photos: {
        type: Array,
        default: () => []
    },
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

const clean = () => {
    modelValue.value = [];
};

const select = src => {
    if (props.disabled) return;

    if (cache.value[src]) {
        const index = modelValue.value.findIndex(element => element === src);
        if (index !== -1) modelValue.value.splice(index, 1);
    } else {
        modelValue.value.push(src);
    }
};

const selectAll = () => {
    modelValue.value = [...props.photos];
};
</script>
