<template>
    <div class="messenger-aside__archive">
        <AccordionSimple>
            <template #title>
                <AccordionSimpleTrigger>
                    {{ title }}
                </AccordionSimpleTrigger>
            </template>
            <template #body>
                <slot />
            </template>
        </AccordionSimple>
    </div>
</template>
<script>
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import AccordionSimpleTrigger from '@/components/common/Accordion/AccordionSimpleTrigger.vue';

export default {
    name: 'MessengerAsideArchive',
    components: { AccordionSimpleTrigger, AccordionSimple },
    props: {
        title: {
            type: String,
            default: null
        }
    }
};
</script>
