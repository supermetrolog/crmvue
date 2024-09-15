<template>
    <div class="accordion-simple">
        <slot name="title" :toggle="toggle">
            <div @click="toggle" class="accordion-simple__header" :class="{ active: isOpen }">
                <span v-if="title">{{ title }}</span>
                <AccordionSimpleTrigger static />
            </div>
        </slot>
        <div class="accordion-simple__body" :class="{ active: isOpen }">
            <div v-if="!withoutRender || isOpened" class="accordion-simple__wrapper">
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
        },
        withoutRender: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isOpen: false,
            isOpened: false,
            closingTimeout: null
        };
    },
    methods: {
        toggle() {
            this.isOpen = !this.isOpen;

            if (this.withoutRender) {
                if (this.isOpen) {
                    this.isOpened = true;
                    this.clearTimeout();
                } else this.close();
            } else this.isOpened = this.isOpen;
        },
        close() {
            clearTimeout(this.closingTimeout);

            this.closingTimeout = setTimeout(() => {
                this.isOpened = false;
                this.clearTimeout();
            }, 500);
        },
        clearTimeout() {
            clearTimeout(this.closingTimeout);
            this.closingTimeout = null;
        }
    },
    created() {
        this.isOpen = this.opened;
        this.isOpened = this.opened;
    },
    beforeUnmount() {
        this.clearTimeout();
    }
};
</script>
