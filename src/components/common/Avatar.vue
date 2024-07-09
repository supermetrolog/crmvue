<template>
    <div class="avatar" :style="{ '--size': size + 'px' }">
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
        default: null
    },
    size: {
        type: [String, Number],
        default: 60
    }
});

const hasError = shallowRef(false);
</script>
