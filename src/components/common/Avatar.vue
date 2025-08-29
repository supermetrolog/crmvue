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
<script setup lang="ts">
import { computed, toRef, useTemplateRef } from 'vue';
import { getLinkUserAvatar } from '@/utils/url.js';
import LazyImage from '@/components/common/LazyImage.vue';
import { useTippyText } from '@/composables/useTippyText.js';

const props = withDefaults(
    defineProps<{
        src?: string | null;
        size?: number | string;
        label?: string;
        rectangle?: boolean;
    }>(),
    { size: 60 }
);

const url = computed(() => getLinkUserAvatar(props.src));

useTippyText(useTemplateRef('avatarEl'), toRef(props, 'label'));
</script>
