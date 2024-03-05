<template>
    <div class="carousel">
        <div :class="{ carousel__scroll: !grid, carousel__grid: grid }">
            <VLazyImage
                v-for="(item, idx) in slides"
                :key="item.src"
                @click="openModal(idx)"
                class="carousel__item"
                :src="item.src"
            />
            <template v-if="!slides.length">
                <NoImage v-for="key in 3" :key="key" />
            </template>
        </div>
        <Modal
            v-if="modalIsOpen"
            @close="clickCloseModal"
            class="carousel__modal"
            :title="modalTitle"
        >
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

<script>
import Modal from '@/components/common/Modal.vue';
import { VueAgile } from 'vue-agile';
import VLazyImage from 'v-lazy-image';
import NoImage from '@/components/common/NoImage.vue';

export default {
    name: 'Carousel',
    components: { NoImage, Modal, VueAgile, VLazyImage },
    props: {
        slides: {
            type: Array,
            required: true
        },
        grid: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            modalIsOpen: false,
            currentSlideIndex: 0,
            mainOptions: {
                dots: false,
                fade: true,
                navButtons: false
            },
            listOptions: {
                centerMode: true,
                dots: false,
                navButtons: true,
                slidesToShow: 3
            }
        };
    },
    computed: {
        modalTitle() {
            return 'Просмотр изображений' + (this.title ? `. ${this.title}` : '');
        }
    },
    methods: {
        openModal(id) {
            this.modalIsOpen = true;
            this.currentSlideIndex = id;
        },
        clickCloseModal() {
            this.currentSlideIndex = 0;
            this.modalIsOpen = false;
        }
    }
};
</script>
