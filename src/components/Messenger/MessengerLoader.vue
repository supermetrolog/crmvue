<template>
    <div class="messenger-loader" :class="{ load: active, finish: finishing }"></div>
</template>
<script setup>
import { shallowRef, watch } from 'vue';

const props = defineProps({
    active: {
        type: Boolean,
        default: false
    }
});

let timeout = null;
const finishing = shallowRef(false);

watch(
    () => props.active,
    value => {
        if (!value) {
            if (timeout) clearTimeout(timeout);

            finishing.value = true;

            timeout = setTimeout(() => {
                finishing.value = false;
                if (timeout) clearTimeout(timeout);
            }, 400);
        }
    }
);
</script>
