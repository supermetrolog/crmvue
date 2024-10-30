<template>
    <VLazyImage @error="hasError = true" :src="url" />
</template>
<script setup>
import VLazyImage from 'v-lazy-image';
import { computed, ref } from 'vue';
import { getApiFileNotFound } from '@/utils/url.js';

const props = defineProps({
    src: {
        type: [String, null],
        required: true
    }
});

const hasError = ref(false);

const url = computed(() => {
    if (hasError.value) return getApiFileNotFound();
    return props.src;
});
</script>
