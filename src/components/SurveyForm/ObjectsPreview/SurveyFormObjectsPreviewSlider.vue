<template>
    <div class="survey-form-object-preview__slides">
        <div
            v-for="slide in slides"
            :key="slide.id"
            @click="$emit('show-preview', slide.id)"
            class="survey-form-object-preview__slide"
        >
            <LazyImage class="survey-form-object-preview__image" :src="slide.src" alt="" />
        </div>
        <div v-if="slides.length === 0" class="survey-form-object-preview__slide">
            <NoImage class="survey-form-object-preview__image" />
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { getLinkFile } from '@/utils/url.js';
import LazyImage from '@/components/common/LazyImage.vue';
import NoImage from '@/components/common/NoImage.vue';

defineEmits(['show-preview']);
const props = defineProps({
    object: {
        type: Object,
        required: true
    }
});

const slides = computed(() => {
    const items = [];

    if (props.object.thumb) {
        items.push({ id: 0, src: props.object.thumb });
    }

    return items.concat(
        props.object.photo
            .filter(element => (props.object.thumb ? !props.object.thumb.includes(element) : true))
            .map((element, key) => ({ id: key + 1, src: getLinkFile(element) }))
    );
});
</script>
