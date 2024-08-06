<template>
    <div v-tippy="label" class="avatar" :style="{ '--size': size + 'px' }">
        <VLazyImage
            @error="hasError = true"
            class="avatar__image"
            :src="hasError ? $url.api.fileNotFound() : $url.api.getUserAvatar(src)"
        />
    </div>
</template>
<script setup>
import VLazyImage from 'v-lazy-image';
import { shallowRef } from 'vue';

defineProps({
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
    }
});

const hasError = shallowRef(false);
</script>
