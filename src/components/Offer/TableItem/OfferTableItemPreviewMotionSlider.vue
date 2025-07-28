<template>
    <div ref="slider" class="offer-table-item-motion-slider">
        <LazyImage class="offer-table-item-motion-slider__main" :src="thumb" />
        <div v-if="photos?.length > 1 && isHovered" class="offer-table-item-motion-slider__list">
            <img
                v-for="element in preparedPhotos"
                :key="element.id"
                alt="offer preview"
                class="offer-table-item-motion-slider__image"
                :src="element.src"
                :class="{
                    active: currentPhotoID === element.id
                }"
            />
            <div
                v-if="photos.length > 5 && currentPhotoID === 4"
                class="offer-table-item-motion-slider__info"
            >
                <p>Ещё</p>
                <p>{{ photos.length - 5 }} фото</p>
            </div>
            <div
                v-for="element in size"
                :key="element"
                v-element-hover="$event => onHover(element - 1, $event)"
                :style="{ width: 100 / size + '%' }"
                :class="{ active: currentPhotoID === element - 1 }"
                class="offer-table-item-motion-slider__ghost"
            ></div>
        </div>
    </div>
</template>

<script setup>
import { useElementHover } from '@vueuse/core';
import { computed, shallowRef, useTemplateRef } from 'vue';
import { vElementHover } from '@vueuse/components';
import LazyImage from '@/components/common/LazyImage.vue';
import { getLinkFile } from '@/utils/url.js';

const props = defineProps({
    thumb: {
        type: String,
        default: null
    },
    photos: {
        type: Array,
        default: () => []
    }
});

const slider = useTemplateRef('slider');
const currentPhotoID = shallowRef(0);

const preparedPhotos = computed(() => {
    return [
        { id: 0, src: props.thumb },
        ...props.photos
            .slice(1, 5)
            .map((element, key) => ({ id: key + 1, src: getLinkFile(element) }))
    ];
});
const size = computed(() => Math.min(props.photos.length, 5));

const isHovered = useElementHover(slider);

const onHover = (elementID, state) => {
    if (state) currentPhotoID.value = elementID;
};
</script>
