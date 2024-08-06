<template>
    <div class="messenger-aside-section">
        <AccordionSimple ref="accordion" opened>
            <template #title>
                <div @click="toggle" class="messenger-aside-section__header">
                    <MessengerAsideHeading :title="title" />
                    <!--                    <MessengerAsideSorting />-->
                    <MessengerLoader :active="loading" />
                </div>
            </template>
            <template #body>
                <slot></slot>
            </template>
        </AccordionSimple>
    </div>
</template>
<script>
import MessengerAsideHeading from '@/components/Messenger/Aside/MessengerAsideHeading.vue';
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import MessengerLoader from '@/components/Messenger/MessengerLoader.vue';

export default {
    name: 'MessengerAsideSection',
    components: { MessengerLoader, AccordionSimple, MessengerAsideHeading },
    props: {
        title: {
            type: String,
            default: null
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        toggle() {
            this.$refs.accordion.toggle();
        }
    }
};
</script>
