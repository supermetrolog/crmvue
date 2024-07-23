<template>
    <AccordionSimple>
        <template #title>
            <AccordionSimpleTrigger class="sidebar-mobile-menu__accordion-trigger">
                <router-link v-slot="{ isActive }" :to="link.url" custom>
                    <div :class="{ current: isActive }" class="sidebar-mobile-menu__accordion">
                        <div class="sidebar-mobile-menu__accordion-label">
                            <i :class="link.icon" />
                            <span>{{ link.name }}</span>
                        </div>
                        <AccordionSimpleTriggerIcon />
                    </div>
                </router-link>
            </AccordionSimpleTrigger>
        </template>
        <template #body>
            <div class="sidebar-mobile-menu__accordion-body">
                <router-link
                    v-for="element in InternalMenu[link.internal]"
                    :key="element.id"
                    class="sidebar-mobile-menu__link"
                    exact-active-class="active"
                    :to="element.url"
                >
                    <span>{{ element.name }}</span>
                </router-link>
            </div>
        </template>
    </AccordionSimple>
</template>

<script setup>
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import AccordionSimpleTrigger from '@/components/common/Accordion/AccordionSimpleTrigger.vue';
import AccordionSimpleTriggerIcon from '@/components/common/Accordion/AccordionSimpleTriggerIcon.vue';
import { InternalMenu } from '@/const/menu.js';
import { useRoute } from 'vue-router';

defineProps({
    link: {
        type: Object,
        required: true
    }
});

const route = useRoute();
</script>
