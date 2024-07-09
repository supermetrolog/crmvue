<template>
    <AccordionSimple class="filters__category">
        <template #title>
            <AccordionSimpleTrigger>
                <AccordionSimpleTriggerIcon />
                <span>{{ title }}</span>
            </AccordionSimpleTrigger>
        </template>
        <template #body>
            <div class="filters__body">
                <slot />
            </div>
        </template>
    </AccordionSimple>
</template>
<script>
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import AccordionSimpleTrigger from '@/components/common/Accordion/AccordionSimpleTrigger.vue';
import AccordionSimpleTriggerIcon from '@/components/common/Accordion/AccordionSimpleTriggerIcon.vue';

export default {
    name: 'FiltersCategory',
    components: { AccordionSimpleTriggerIcon, AccordionSimpleTrigger, AccordionSimple },
    props: {
        title: {
            type: String,
            required: true
        }
    }
};
</script>
