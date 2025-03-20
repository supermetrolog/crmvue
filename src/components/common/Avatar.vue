<template>
    <div
        ref="avatarEl"
        class="avatar"
        :class="{ rectangle: rectangle }"
        :style="{ '--size': size + 'px' }"
    >
        <LazyImage class="avatar__image" :src="url" />
    </div>
</template>
<script setup>
import { computed, toRef, useTemplateRef } from 'vue';
import { getLinkUserAvatar } from '@/utils/url.js';
import LazyImage from '@/components/common/LazyImage.vue';
import { useTippyText } from '@/composables/useTippyText.js';

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

useTippyText(useTemplateRef('avatarEl'), toRef(props, 'label'));
</script>
