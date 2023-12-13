<template>
    <div class="Carousel">
        <div class="Carousel-scroll">
            <img class="Carousel-scroll-item" v-for="(item, idx) in imgList" :key="item.src" :src="item.src"
                 @click="openModal(idx)"/>
        </div>
        <transition mode="out-in" enter-active-class="animate__animated animate__zoomIn for__modal absolute"
                    leave-active-class="animate__animated animate__zoomOut for__modal absolute">
            <Modal v-if="lightboxActive" :title="'Имя объекта'" @close="clickCloseModal" class="autosize">
                <img class="currImg" :src="imgList[currImgIdx].src"/>
                <div>
                    <transition-group class="CROP" :name="transition_name" tag="div">
                        <div class="Carousel_chunk" v-for="(chunk, i) in arrChunk" v-show="currSlide == i" :key="i">
                            <div class="chunk_item" v-for="(item, j) in chunk" :key="j"
                                 @click="currImgIdx = j + (i * chunkSize)"
                                 :class="{ CURR: item.src == imgList[currImgIdx].src }">
                                <img :src="item.src"/>
                            </div>
                        </div>
                    </transition-group>
                    <div class="Carousel-controls">
                        <svg @click="prev" width="48" height="48" viewBox="0 0 24 24" fill="gold" stroke="currentColor"
                             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 8 8 12 12 16"></polyline>
                            <line x1="16" y1="12" x2="8" y2="12"></line>
                        </svg>
                        <div class="Carousel-controls_dot" v-for="(dot, i) in arrChunk" :key="i"
                             :class="{ CURR: currSlide == i }" @click="goToChunk(i)">{{ i + 1 }}
                        </div>
                        <svg @click="next" width="48" height="48" viewBox="0 0 24 24" fill="gold" stroke="currentColor"
                             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 16 16 12 12 8"></polyline>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                    </div>
                </div>
            </Modal>
        </transition>

    </div>
</template>

<script>


import Modal from "@/components/common/Modal.vue";

export default {
    name: 'Carousel',
    components: {Modal},
    props: {
        list: {
            type: Array,
            required: true
        },
        chunkSize: {
            type: Number,
            default: 4
        },
    },
    mounted() {
        if (!this.list.length) {
            this.imgList = Array.from({length: 33}, (v, i) => ({src: `//raw.githubusercontent.com/codrops/HoverEffectIdeas/master/img/${i + 1}.jpg`}))
        }
    },
    data() {
        return {
            imgList: this.list,
            currSlide: 0,
            currImgIdx: 1,
            transition_name: "slide_next",
            lightboxActive: false,
            currLightboxImg: 15,
            modalIsOpen: false
        }
    },
    watch: {
        currImgIdx(newVal) {
            this.currLightboxImg = newVal
        }
    },
    computed: {
        arrChunk() {
            return Array
                .from({length: Math.ceil(this.imgList.length / this.chunkSize)}, (v, i) =>
                    this.imgList.slice(i * this.chunkSize, i * this.chunkSize + this.chunkSize)
                );
        }
    },
    methods: {
        prev() {
            this.transition_name = "slide_prev";
            this.currSlide = this.currSlide == 0 ? this.arrChunk.length - 1 : this.currSlide - 1;
        },
        next() {
            this.transition_name = "slide_next";
            this.currSlide = this.currSlide == this.arrChunk.length - 1 ? 0 : this.currSlide + 1;
        },
        goToImg(n) {
            this.currLightboxImg = n < 0 ? this.imgList.length - 1 : n % this.imgList.length;
        },
        goToChunk(idx) {
            this.transition_name = (idx < this.currSlide) ? "slide_prev" : "slide_next";
            this.currSlide = idx;
        },
        openModal(idx) {
            this.lightboxActive = true;
            this.currImgIdx = idx;
            this.currSlide = Math.floor(idx / this.chunkSize)
        },
        clickCloseModal() {
            this.lightboxActive = false
            this.currLightboxImg = this.currImgIdx
        }
    }
}
</script>