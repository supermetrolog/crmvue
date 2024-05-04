<template>
    <div class="messenger-aside-heading">
        <AccordionSimpleTrigger static />
        <span class="messenger-aside-heading__title">{{ title }}</span>
    </div>
</template>
<script>
import AccordionSimpleTrigger from '@/components/common/Accordion/AccordionSimpleTrigger.vue';

export default {
    name: 'MessengerAsideHeading',
    components: { AccordionSimpleTrigger },
    props: {
        title: {
            type: String,
            default: 'Список'
        }
    }
};
</script>
