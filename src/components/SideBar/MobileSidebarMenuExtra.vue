<template>
    <AccordionSimple>
        <template #title>
            <AccordionSimpleTrigger class="sidebar-mobile-menu__accordion-trigger">
                <router-link v-slot="{ isActive }" :to="{ name: link.to }" custom>
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
                    v-for="element in internal"
                    :key="element.key"
                    class="sidebar-mobile-menu__link"
                    exact-active-class="active"
                    :to="{ name: element.config.to }"
                >
                    <span>{{ element.config.name }}</span>
                </router-link>
            </div>
        </template>
    </AccordionSimple>
</template>

<script setup lang="ts">
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import AccordionSimpleTrigger from '@/components/common/Accordion/AccordionSimpleTrigger.vue';
import AccordionSimpleTriggerIcon from '@/components/common/Accordion/AccordionSimpleTriggerIcon.vue';
import { GeneralMenuItemConfig, InternalMenuItemConfig } from '@/const/menu.js';

defineProps<{
    link: GeneralMenuItemConfig;
    internal: { key: number; config: InternalMenuItemConfig }[];
}>();
</script>
