<template>
    <div ref="carousel" class="carousel">
        <div :class="{ carousel__scroll: !grid, carousel__grid: grid }">
            <VLazyImage
                v-for="(item, idx) in photos"
                :key="item.src"
                @click="openModal(idx)"
                class="carousel__item"
                :style="{ 'flex-basis': flexBasis + '%' }"
                :src="item.src"
            />
            <div v-if="slides.length > count" class="carousel__item carousel__gallery">
                <VLazyImage
                    v-for="(item, key) in gallery"
                    :key="key"
                    @click="openModal(count + key)"
                    class="carousel__cell"
                    :src="item.src ?? $url.api.fileNotFound()"
                />
                <div
                    v-if="slides.length > count + 4"
                    @click.prevent="openModal(count + 4)"
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
        <Modal v-if="modalIsOpen" @close="closeModal" class="carousel__modal" :title="modalTitle">
            <VueAgile
                ref="main"
                class="carousel__slides"
                :options="mainOptions"
                :initialSlide="currentSlideIndex"
            >
                <div
                    v-for="(slide, slideKey) in slides"
                    :key="slideKey"
                    class="carousel__slide"
                    :class="`slide--${slideKey}`"
                >
                    <VLazyImage class="carousel__image" :src="slide.src" alt="img" />
                </div>
            </VueAgile>
            <VueAgile
                ref="thumbnails"
                @after-change="$refs.main.goTo($event.currentSlide)"
                :options="listOptions"
                class="carousel__thumbnails"
                :initialSlide="currentSlideIndex"
            >
                <div
                    v-for="(slide, idx) in slides"
                    :key="idx"
                    @click="$refs.thumbnails.goTo(idx)"
                    class="carousel__thumbnail"
                    :class="`slide--${idx}`"
                >
                    <VLazyImage class="carousel__image" :src="slide.src" alt="" />
                </div>
                <template #prevButton>
                    <i class="fas fa-chevron-left"></i>
                </template>
                <template #nextButton>
                    <i class="fas fa-chevron-right"></i>
                </template>
            </VueAgile>
        </Modal>
    </div>
</template>

<script setup>
import Modal from '@/components/common/Modal.vue';
import { VueAgile } from 'vue-agile';
import VLazyImage from 'v-lazy-image';
import NoImage from '@/components/common/NoImage.vue';
import { computed, onMounted, ref, shallowRef } from 'vue';

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

const mainOptions = {
    dots: false,
    fade: true,
    navButtons: false
};

const listOptions = {
    centerMode: true,
    dots: false,
    navButtons: true,
    slidesToShow: 3
};

const modalIsOpen = shallowRef(false);
const currentSlideIndex = shallowRef(0);
const carousel = ref(null);
const count = shallowRef(0);
const flexBasis = shallowRef(null);

const modalTitle = computed(() => 'Просмотр изображений. ' + (props.title ?? ''));
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

const openModal = id => {
    modalIsOpen.value = true;
    currentSlideIndex.value = id;
};

const closeModal = () => {
    currentSlideIndex.value = 0;
    modalIsOpen.value = false;
};

const createGallery = () => {
    const width = carousel.value.clientWidth;
    console.log(width);
    const _count = Math.floor(width / IMAGE_SIZE);
    flexBasis.value = 100 / _count;

    if (_count === props.slides.length) count.value = _count;
    else count.value = _count - 1;
};

onMounted(() => {
    createGallery();
});
</script>
