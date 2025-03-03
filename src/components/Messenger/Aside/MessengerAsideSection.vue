<template>
    <div class="messenger-aside-section" :class="{ opened: isOpened }">
        <AccordionSimple ref="accordion" opened>
            <template #title>
                <div @click="toggle" class="messenger-aside-section__header">
                    <MessengerAsideHeading :title="title" />
                    <MessengerAsideSorting
                        v-model:filters="filters"
                        v-model:sort="sorts"
                        @reset="$emit('reset')"
                    >
                        <template #filters>
                            <slot name="filters" />
                        </template>
                    </MessengerAsideSorting>
                    <MessengerLoader :active="loading" />
                </div>
            </template>
            <template #body>
                <slot>
                    <span></span>
                </slot>
            </template>
        </AccordionSimple>
    </div>
</template>
<script setup>
import MessengerAsideHeading from '@/components/Messenger/Aside/MessengerAsideHeading.vue';
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import MessengerLoader from '@/components/Messenger/MessengerLoader.vue';
import { computed, useTemplateRef } from 'vue';
import MessengerAsideSorting from '@/components/Messenger/Aside/MessengerAsideSorting.vue';

const filters = defineModel('filters');
const sorts = defineModel('sort', { type: Array, default: () => [] });
defineEmits(['reset']);
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

const accordion = useTemplateRef('accordion');

const isOpened = computed(() => {
    if (accordion.value) return accordion.value.isOpened;
    return false;
});

const toggle = () => {
    accordion.value.toggle();
};
</script>
