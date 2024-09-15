<template>
    <div class="messenger-panel-company__tab">
        <AccordionSimple without-render :opened="opened">
            <template #title="{ toggle }">
                <div
                    @click="toggle"
                    class="messenger-aside-section__header messenger-panel-company__heading"
                >
                    <div class="messenger-aside-heading">
                        <AccordionSimpleTrigger static />
                        <span class="messenger-aside-heading__title">
                            {{ title }}
                            ({{ count }})
                        </span>
                    </div>
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
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import MessengerLoader from '@/components/Messenger/MessengerLoader.vue';
import AccordionSimpleTrigger from '@/components/common/Accordion/AccordionSimpleTrigger.vue';

defineProps({
    title: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        default: 0
    },
    loading: {
        type: Boolean,
        default: false
    },
    opened: {
        type: Boolean,
        default: false
    }
});
</script>
