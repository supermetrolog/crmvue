<template>
    <div class="accordion-simple">
        <slot name="title">
            <div @click="toggle" class="accordion-simple__header" :class="{ active: isOpen }">
                <span v-if="title">{{ title }}</span>
                <AccordionSimpleTrigger static />
            </div>
        </slot>
        <div class="accordion-simple__body" :class="{ active: isOpen }">
            <div class="accordion-simple__wrapper">
                <slot name="body"></slot>
            </div>
        </div>
    </div>
</template>
<script>
import AccordionSimpleTrigger from '@/components/common/Accordion/AccordionSimpleTrigger.vue';
import { computed } from 'vue';

export default {
    name: 'AccordionSimple',
    components: { AccordionSimpleTrigger },
    provide() {
        return {
            $accordionIsOpened: computed(() => this.isOpen),
            $toggleAccordion: () => this.toggle()
        };
    },
    props: {
        title: {
            type: String,
            default: null
        },
        opened: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isOpen: false
        };
    },
    methods: {
        toggle() {
            this.isOpen = !this.isOpen;
        }
    },
    mounted() {
        this.isOpen = this.opened;
    }
};
</script>
