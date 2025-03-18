<template>
    <div class="accordion-simple">
        <slot
            name="trigger"
            :toggle="toggle"
            :opened="isVisibleModelValue"
            :close="close"
            :open="open"
        >
            <UiAccordionButton
                @click="toggle"
                :class="{ active: isVisibleModelValue }"
                :label="title"
                :opened="isVisibleModelValue"
                class="w-100"
            />
        </slot>
        <div class="accordion-simple__body" :class="[{ active: isVisibleModelValue }, bodyClass]">
            <div v-if="!withoutRender || isOpened" class="accordion-simple__wrapper">
                <slot
                    name="body"
                    :opened="isVisibleModelValue"
                    :close="close"
                    :open="open"
                    :toggle="toggle"
                ></slot>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onBeforeUnmount, ref, watch } from 'vue';
import UiAccordionButton from '@/components/common/UI/Accordion/UiAccordionButton.vue';

const isVisibleModelValue = defineModel({ type: Boolean });

const props = defineProps({
    title: String,
    opened: Boolean,
    withoutRender: Boolean,
    bodyClass: [String, Array, Object]
});

isVisibleModelValue.value = props.opened;

const isOpened = ref(isVisibleModelValue.value);

let closingTimeout = null;

function toggle() {
    isVisibleModelValue.value = !isVisibleModelValue.value;
}

function open() {
    isVisibleModelValue.value = true;
}

function close() {
    isVisibleModelValue.value = false;
}

watch(isVisibleModelValue, value => {
    if (props.withoutRender) {
        if (value) {
            isOpened.value = true;

            clear();
        } else {
            clear();

            closingTimeout = setTimeout(() => {
                isOpened.value = false;
                clear();
            }, 500);
        }
    } else {
        isOpened.value = value;
    }
});

function clear() {
    clearTimeout(closingTimeout);
    closingTimeout = null;
}

onBeforeUnmount(() => {
    clearTimeout();
});

defineExpose({ toggle, close, open });
</script>
