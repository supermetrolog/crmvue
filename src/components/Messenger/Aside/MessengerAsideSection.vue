<template>
    <div class="messenger-aside-section" :class="{ opened: isOpened }">
        <AccordionSimple ref="accordion" opened>
            <template #title>
                <div @click="toggle" class="messenger-aside-section__header">
                    <MessengerAsideHeading :title="title" />
                    <MessengerAsideSorting v-model:filters="filters" v-model:sort="sorts" />
                    <MessengerLoader :active="loading" />
                </div>
            </template>
            <template #body>
                <slot></slot>
            </template>
        </AccordionSimple>
    </div>
</template>
<script setup>
import MessengerAsideHeading from '@/components/Messenger/Aside/MessengerAsideHeading.vue';
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import MessengerLoader from '@/components/Messenger/MessengerLoader.vue';
import { computed, shallowRef } from 'vue';
import MessengerAsideSorting from '@/components/Messenger/Aside/MessengerAsideSorting.vue';

const filters = defineModel('filters', { type: Array, default: () => [] });
const sorts = defineModel('sort', { type: Array, default: () => [] });
defineProps({
    title: {
        type: String,
        default: null
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const accordion = shallowRef(null);

const isOpened = computed(() => {
    if (accordion.value) return accordion.value.isOpened;
    return false;
});

const toggle = () => {
    accordion.value.toggle();
};
</script>
