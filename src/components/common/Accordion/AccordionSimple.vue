<template>
    <div class="accordion-simple">
        <slot name="title" :toggle="toggle" :opened="isOpen">
            <div @click="toggle" class="accordion-simple__header" :class="{ active: isOpen }">
                <span v-if="title">{{ title }}</span>
                <AccordionSimpleTrigger static />
            </div>
        </slot>
        <div class="accordion-simple__body" :class="[{ active: isOpen }, bodyClass]">
            <div v-if="!withoutRender || isOpened" class="accordion-simple__wrapper">
                <slot name="body"></slot>
            </div>
        </div>
    </div>
</template>
<script setup>
import AccordionSimpleTrigger from '@/components/common/Accordion/AccordionSimpleTrigger.vue';
import { onBeforeUnmount, provide, ref } from 'vue';

const props = defineProps({
    title: String,
    opened: Boolean,
    withoutRender: Boolean,
    bodyClass: [String, Array, Object]
});

const isOpen = ref(props.opened);
const isOpened = ref(props.opened);

let closingTimeout = null;

function toggle() {
    isOpen.value = !isOpen.value;

    if (props.withoutRender) {
        if (isOpen.value) {
            isOpened.value = true;
            clear();
        } else close();
    } else isOpened.value = isOpen.value;
}

function close() {
    clearTimeout(closingTimeout);

    closingTimeout = setTimeout(() => {
        isOpened.value = false;
        clear();
    }, 500);
}

function clear() {
    clearTimeout(closingTimeout);
    closingTimeout = null;
}

onBeforeUnmount(() => {
    clearTimeout();
});

provide('$accordionIsOpened', isOpen);
provide('$toggleAccordion', toggle);

defineExpose({ toggle, close });
</script>
