<template>
    <Modal @close="toggle" :show="isOpened" class="modal-previewer" :title="title" :width="width">
        <template #header>
            <Button v-tippy="'В разработке..'" disabled class="ml-2" small icon>
                <span>Скачать фотографии</span>
                <i class="fa-regular fa-image" />
            </Button>
        </template>
        <div class="previewer">
            <VueAgile
                v-if="images.length > 1"
                ref="slider"
                @after-change="currentSlideIndex = $event.currentSlide"
                class="previewer__slider"
                :dots="false"
                :initialSlide="currentSlideIndex"
                :speed="200"
                :throttle-delay="200"
                center-mode
                fade
            >
                <div v-for="slide in images" :key="slide.id" class="previewer__slide">
                    <LazyImage class="previewer__preview" :src="slide.src" />
                </div>
                <template #prevButton>
                    <HoverActionsButton class="previewer__arrow">
                        <i class="fas fa-chevron-left"></i>
                    </HoverActionsButton>
                </template>
                <template #nextButton>
                    <HoverActionsButton class="previewer__arrow">
                        <i class="fas fa-chevron-right"></i>
                    </HoverActionsButton>
                </template>
            </VueAgile>
            <div v-else class="previewer__single">
                <LazyImage :src="images[0].src" />
            </div>
        </div>
        <template v-if="images.length > 1" #footer>
            <div class="previewer__thumbnails">
                <div
                    v-for="(slide, idx) in images"
                    :key="slide.id"
                    @click="slider.goTo(idx)"
                    class="previewer__thumbnail"
                    :class="{ active: idx === currentSlideIndex }"
                >
                    <LazyImage class="previewer__image" :src="slide.src" alt="" />
                </div>
            </div>
        </template>
    </Modal>
</template>
<script setup>
import Modal from '@/components/common/Modal.vue';
import { computed, ref, shallowRef, useTemplateRef, watch } from 'vue';
import { VueAgile } from 'vue-agile';
import LazyImage from '@/components/common/LazyImage.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import Button from '@/components/common/Button.vue';

const slider = useTemplateRef('slider');

const isOpened = ref(false);
const images = shallowRef([]);
const currentSlideIndex = ref(0);

const title = computed(() => {
    if (images.value.length === 1) return 'Просмотр изображения';
    return `Просмотр изображений (${images.value.length})`;
});

const width = computed(() => (images.value.length > 1 ? 1200 : null));

const keyHandler = event => {
    if (event.keyCode === 39 || event.keyCode === 68) slider.value.goToNext();
    else if (event.keyCode === 37 || event.keyCode === 65) slider.value.goToPrev();
};

watch(isOpened, (value, oldValue, onCleanup) => {
    if (value) document.addEventListener('keydown', keyHandler, true);
    else document.removeEventListener('keydown', keyHandler, true);

    onCleanup(() => {
        document.removeEventListener('keydown', keyHandler, true);
    });
});
const toggle = (data = null, currentSlideId = null) => {
    if (!data) {
        currentSlideIndex.value = 0;
        isOpened.value = !isOpened.value;
        images.value = [];
        return;
    }

    if (Array.isArray(data)) {
        images.value = data;
    } else {
        images.value = [data];
    }

    if (currentSlideId !== null) {
        currentSlideIndex.value = Math.max(
            0,
            images.value.findIndex(element => element.id === currentSlideId)
        );
    }

    isOpened.value = !isOpened.value;
};

defineExpose({ toggle });
</script>
