<template>
    <div
        v-tippy="label"
        class="avatar"
        :class="{ rectangle: rectangle }"
        :style="{ '--size': size + 'px' }"
    >
        <LazyImage class="avatar__image" :src="url" />
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { getLinkUserAvatar } from '@/utils/url.js';
import LazyImage from '@/components/common/LazyImage.vue';

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

const url = computed(() => getLinkUserAvatar(props.src));
</script>
