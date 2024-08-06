<template>
    <div @click="play()" class="vue-vivus">
        <slot :uid="vivusID"></slot>
    </div>
</template>
<script setup>
import { getCurrentInstance, onBeforeUnmount, onMounted } from 'vue';
import Vivus from 'vivus';

const emit = defineEmits(['ready']);

const props = defineProps({
    duration: {
        type: Number,
        default: 200
    },
    type: {
        type: String,
        default: 'delayed'
    },
    startType: {
        type: String,
        default: 'inViewport'
    },
    autoPlay: {
        type: Boolean,
        default: false
    },
    once: {
        type: Boolean,
        default: false
    }
});

let vivus = null;

const vivusID = 'vue-vivus-' + getCurrentInstance().uid;

const play = (speed = 2, callback) => {
    return vivus.reset().play(speed, callback);
};
const stop = () => vivus.stop();
const reset = () => vivus.reset();
const finish = () => vivus.finish();
const getStatus = () => vivus.getStatus();
const destroy = () => vivus.destroy();

defineExpose({ play, stop, reset, finish, getStatus, destroy });

const resizeObserver = new ResizeObserver(() => {
    vivus.recalc();
});

onMounted(() => {
    vivus = new Vivus(
        vivusID,
        {
            duration: props.duration,
            type: props.type,
            start: 'manual'
        },
        element => {
            emit('ready', element);
            if (props.once) destroy();
        }
    );

    if (props.autoPlay) play();

    resizeObserver.observe(vivus.el);
});

onBeforeUnmount(() => {
    destroy();
});
</script>
