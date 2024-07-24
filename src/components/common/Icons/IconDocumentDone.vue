<template>
    <div class="icon-document-done">
        <div class="icon-document-done__inner" :class="{ ready: isReady }">
            <svg
                width="70px"
                height="70px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M13 3H5V5M13 3H14L19 8V9M13 3V7C13 8 14 9 15 9H19M19 9V12M5 10V21H19V16"
                    stroke="#fff"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
            <VueVivus
                ref="vivus"
                v-slot="{ uid }"
                @ready="onReady"
                :duration="100"
                class="icon-document-done__check"
            >
                <svg
                    :id="uid"
                    height="36px"
                    width="36px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M4 12.6111L8.92308 17.5L20 6.5"
                        stroke="#fff"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </VueVivus>
        </div>
        <div class="icon-document-done__back"></div>
    </div>
</template>
<script setup>
import VueVivus from '@/components/common/VueVivus.vue';
import { computed, ref, shallowRef } from 'vue';

const props = defineProps({
    size: {
        type: Number,
        default: 100
    },
    ready: {
        type: Boolean,
        default: false
    }
});

const isReady = shallowRef(false);
const vivus = ref(null);

defineExpose({ play: () => vivus.value.play() });

const onReady = () => {
    isReady.value = true;
};
</script>
