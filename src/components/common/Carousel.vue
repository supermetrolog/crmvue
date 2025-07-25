<template>
    <div ref="carousel" class="carousel">
        <div :class="{ carousel__scroll: !grid, carousel__grid: grid }">
            <VLazyImage
                v-for="item in photos"
                :key="item.src"
                @click="openPreview(item.id)"
                class="carousel__item"
                :style="{ 'flex-basis': flexBasis + '%' }"
                :src="item.src"
            />
            <div v-if="slides.length > count" class="carousel__item carousel__gallery">
                <VLazyImage
                    v-for="item in gallery"
                    :key="item.src"
                    @click="openPreview(item.id)"
                    class="carousel__cell"
                    :src="item.src ?? notFoundUrl"
                />
                <div
                    v-if="slides.length > count + 4"
                    @click.prevent="openPreview(slides[count + 4])"
                    class="carousel__helper"
                >
                    <p>Ещё</p>
                    <p>{{ slides.length - count - 4 }} фото</p>
                </div>
            </div>
            <template v-if="!slides.length">
                <NoImage
                    v-for="key in count + 1"
                    :key="key"
                    :style="{ 'flex-basis': flexBasis + '%' }"
                    class="carousel__item"
                />
            </template>
        </div>
    </div>
</template>

<script setup>
import VLazyImage from 'v-lazy-image';
import NoImage from '@/components/common/NoImage.vue';
import { computed, onMounted, ref } from 'vue';
import { usePreviewer } from '@/composables/usePreviewer.js';
import { getApiFileNotFound } from '@/utils/url.js';

const IMAGE_SIZE = 325;

const props = defineProps({
    slides: {
        type: Array,
        default: () => []
    },
    grid: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: null
    }
});

const carousel = ref(null);
const count = ref(0);
const flexBasis = ref(null);

const photos = computed(() => {
    if (props.slides.length <= count.value) return props.slides;
    return props.slides.slice(0, count.value);
});

const gallery = computed(() => {
    const _gallery = props.slides.slice(count.value, count.value + 4);

    if (_gallery.length < 4)
        // eslint-disable-next-line no-unused-vars
        _gallery.push(...Array.from(Array(4 - _gallery.length).keys()).map(_ => ({ src: null })));

    return _gallery;
});

const createGallery = () => {
    const width = carousel.value.clientWidth;
    const _count = Math.floor(width / IMAGE_SIZE);
    flexBasis.value = 100 / _count;

    if (_count === props.slides.length) count.value = _count;
    else count.value = _count - 1;
};

onMounted(() => {
    createGallery();
});

const notFoundUrl = computed(() => getApiFileNotFound());

// preview

const { preview } = usePreviewer();

const openPreview = id => {
    preview(props.slides, id);
};
</script>
