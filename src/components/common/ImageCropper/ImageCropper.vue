<template>
    <div class="image-cropper" :class="{ 'image-cropper--picking': colorPickerIsEnabled }">
        <div v-if="$slots.header" class="image-cropper__header">
            <slot name="header"></slot>
        </div>
        <div class="image-cropper__container">
            <AnimationTransition :speed="0.4">
                <UiField v-if="colorPickerIsEnabled" class="image-cropper__field" color="light">
                    Режим выбора цвета для заливки
                </UiField>
            </AnimationTransition>
            <div class="image-cropper__image">
                <img ref="cropperEl" :src="src" alt="cropped img" crossorigin="anonymous" />
            </div>
            <div class="image-cropper__controls">
                <ImageCropperFill
                    v-if="fill"
                    v-model="fillColor"
                    @open="onOpenFill"
                    @close="onCloseFill"
                    :preview="filledImage"
                />
            </div>
        </div>
        <div v-if="$slots.footer" class="image-cropper__footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, ref, shallowRef, useTemplateRef, watch } from 'vue';
import Cropper from 'cropperjs';
import { useDebounceFn } from '@vueuse/core';
import ImageCropperFill from '@/components/common/ImageCropper/ImageCropperFill.vue';
import UiField from '@/components/common/UI/UiField.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

const emit = defineEmits(['cropend']);
const props = defineProps({
    options: {
        type: Object,
        default: () => ({})
    },
    src: String,
    viewMode: {
        type: Number,
        default: 0
    },
    dragMode: {
        type: String,
        default: 'move'
    },
    initialAspectRatio: {
        type: Boolean,
        default: true
    },
    aspectRatio: {
        type: Number,
        default: 1
    },
    guides: {
        type: Boolean,
        default: false
    },
    center: {
        type: Boolean,
        default: true
    },
    highlight: {
        type: Boolean,
        default: true
    },
    background: Boolean,
    autoCrop: {
        type: Boolean,
        default: true
    },
    autoCropArea: {
        type: Number,
        default: 0.8
    },
    movable: {
        type: Boolean,
        default: true
    },
    rotatable: {
        type: Boolean,
        default: true
    },
    scalable: {
        type: Boolean,
        default: true
    },
    zoomable: {
        type: Boolean,
        default: true
    },
    zoomOnTouch: {
        type: Boolean,
        default: true
    },
    zoomOnWheel: {
        type: Boolean,
        default: true
    },
    cropBoxMovable: {
        type: Boolean,
        default: true
    },
    cropBoxResizable: {
        type: Boolean,
        default: true
    },
    toggleDragModeOnDblclick: Boolean,
    minContainerWidth: {
        type: Number,
        default: 60
    },
    minContainerHeight: {
        type: Number,
        default: 60
    },
    minCropBoxWidth: {
        type: Number,
        default: 60
    },
    minCropBoxHeight: {
        type: Number,
        default: 60
    },
    height: {
        type: Number,
        default: 300
    },
    width: {
        type: Number,
        default: 300
    },
    needTransform: Boolean,
    fill: Boolean
});

watch(
    () => props.src,
    value => {
        cropper.replace(value);
        generatePreview();
    }
);

const cropperEl = useTemplateRef('cropperEl');

const isReady = ref(false);

let cropper = null;

const widthInPx = computed(() => props.width + 'px');
const heightInPx = computed(() => props.height + 'px');

function rotate(degree) {
    if (isReady.value) cropper.rotate(degree);
}

function reset() {
    if (isReady.value) cropper.reset();
}

function getUrl() {
    if (isReady.value) return cropper.getCroppedCanvas({ fillColor: fillColor.value }).toDataURL();
}

async function getBlob() {
    if (!isReady.value) return;

    let resolve = () => {};

    const promise = new Promise(_resolve => {
        resolve = _resolve;
    });

    cropper.getCroppedCanvas({ fillColor: fillColor.value }).toBlob(blob => {
        resolve(blob);
    });

    return await promise;
}

defineExpose({ rotate, reset, getUrl, getBlob });

const createOptions = () => {
    return {
        viewMode: props.viewMode,
        dragMode: props.dragMode,
        aspectRatio: props.aspectRatio,
        guides: props.guides,
        center: props.center,
        highlight: props.highlight,
        background: props.background,
        autoCrop: props.autoCrop,
        autoCropArea: props.autoCropArea,
        movable: props.movable,
        rotatable: props.rotatable,
        scalable: props.scalable,
        zoomable: props.zoomable,
        zoomOnTouch: props.zoomOnTouch,
        zoomOnWheel: props.zoomOnWheel,
        minContainerWidth: props.minContainerWidth,
        minContainerHeight: props.minContainerHeight,
        minCropBoxWidth: props.minCropBoxWidth,
        minCropBoxHeight: props.minCropBoxHeight,
        cropBoxMovable: props.cropBoxMovable,
        cropBoxResizable: props.cropBoxResizable,
        toggleDragModeOnDblclick: props.toggleDragModeOnDblclick,
        ready() {
            isReady.value = true;
            generatePreview();
        },
        cropend() {
            emit('cropend');
            generatePreview();
        },
        zoom() {
            generatePreview();
        }
    };
};

const initCropper = () => {
    destroyCropper();
    cropper = new Cropper(cropperEl.value, createOptions());
};

const destroyCropper = () => {
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
};

onMounted(initCropper);
onUnmounted(destroyCropper);

// fill

const filledImage = shallowRef(null);
const fillColor = ref(undefined);
const colorPickerIsEnabled = ref(false);

const generatePreview = useDebounceFn(() => {
    filledImage.value = getUrl();
}, 300);

watch(fillColor, generatePreview);

function onOpenFill() {
    colorPickerIsEnabled.value = true;
}

function onCloseFill() {
    colorPickerIsEnabled.value = false;
}
</script>
<style scoped>
.image-cropper__image {
    height: v-bind(heightInPx);
    width: v-bind(widthInPx);
}
</style>
