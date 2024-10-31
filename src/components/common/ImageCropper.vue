<template>
    <div class="image-cropper">
        <div v-if="$slots.header" class="image-cropper__header">
            <slot name="header"></slot>
        </div>
        <div class="image-cropper__container">
            <div class="image-cropper__image">
                <img ref="cropperEl" :src="src" alt="cropped img" />
            </div>
            <div class="image-cropper__controls">
                <slot name="controls"></slot>
            </div>
        </div>
        <div v-if="$slots.footer" class="image-cropper__footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';
import Cropper from 'cropperjs';

const emit = defineEmits(['cropend']);
const props = defineProps({
    options: {
        type: Object,
        default: () => ({})
    },
    src: {
        type: String,
        default: null
    },
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
    background: {
        type: Boolean,
        default: false
    },
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
    toggleDragModeOnDblclick: {
        type: Boolean,
        default: false
    },
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
    needTransform: {
        type: Boolean,
        default: false
    }
});

watch(
    () => props.src,
    value => {
        cropper.replace(value);
    }
);

const cropperEl = useTemplateRef('cropperEl');

const isReady = ref(false);

let cropper = null;

const widthInPx = computed(() => props.width + 'px');
const heightInPx = computed(() => props.height + 'px');

const rotate = degree => {
    if (isReady.value) cropper.rotate(degree);
};

const reset = () => {
    if (isReady.value) cropper.reset();
};
const getUrl = () => {
    if (isReady.value) return cropper.getCroppedCanvas().toDataURL();
};

const getBlob = async () => {
    if (!isReady.value) return;

    let resolve = () => {};

    const promise = new Promise(_resolve => {
        resolve = _resolve;
    });

    cropper.getCroppedCanvas().toBlob(blob => {
        resolve(blob);
    });

    return await promise;
};

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
            console.log('is ready');
            isReady.value = true;
        },
        cropend() {
            emit('cropend');
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

onMounted(async () => {
    initCropper();
});
onUnmounted(() => {
    destroyCropper();
});
</script>
<style scoped>
.image-cropper__image {
    height: v-bind(heightInPx);
    width: v-bind(widthInPx);
}
</style>
