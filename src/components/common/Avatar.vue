<template>
    <div
        v-tippy="label"
        class="avatar"
        :class="{ rectangle: rectangle }"
        :style="{ '--size': size + 'px' }"
    >
        <VLazyImage @error="hasError = true" class="avatar__image" :src="url" />
    </div>
</template>
<script setup>
import VLazyImage from 'v-lazy-image';
import { computed, shallowRef } from 'vue';
import { getApiFileNotFound, getLinkUserAvatar } from '@/utils/url.js';

const props = defineProps({
    src: {
        type: String,
        default: undefined
    },
    size: {
        type: [String, Number],
        default: 60
    },
    label: {
        type: String,
        default: undefined
    },
    rectangle: {
        type: Boolean,
        default: false
    }
});

const hasError = shallowRef(false);
const url = computed(() => {
    if (hasError.value) return getApiFileNotFound();
    return getLinkUserAvatar(props.src);
});
</script>
