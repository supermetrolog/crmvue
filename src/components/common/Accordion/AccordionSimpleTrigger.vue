<template>
    <div
        @click.prevent="handler"
        class="accordion-simple__trigger"
        :class="{ active: $accordionIsOpened }"
    >
        <slot>
            <AccordionSimpleTriggerIcon />
        </slot>
    </div>
</template>
<script>
import AccordionSimpleTriggerIcon from '@/components/common/Accordion/AccordionSimpleTriggerIcon.vue';

export default {
    name: 'AccordionSimpleTrigger',
    components: { AccordionSimpleTriggerIcon },
    inject: ['$toggleAccordion', '$accordionIsOpened'],
    props: {
        static: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        handler() {
            if (!this.static) this.$toggleAccordion();
        }
    }
};
</script>
