<template>
    <div class="v-mobile-layout">
        <TheMobileHeader class="v-mobile-layout__header" />
        <main class="v-mobile-layout__content">
            <router-view v-slot="{ Component }">
                <AnimationTransition :speed="0.1">
                    <component :is="Component"></component>
                </AnimationTransition>
            </router-view>
        </main>
        <!--        <Messenger v-if="THIS_USER" ref="messenger" class="v-mobile-layout__messenger" />-->
        <teleport to="body">
            <Previewer ref="previewer" />
        </teleport>
        <PopupsWrapper />
    </div>
</template>

<script setup>
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import Previewer from '@/components/common/Previewer.vue';
import TheMobileHeader from '@/components/Header/TheMobileHeader.vue';
import PopupsWrapper from '@/components/common/PopupsWrapper.vue';
import { provide, shallowRef } from 'vue';

const previewer = shallowRef(null);

provide('$openPreviewer', image => previewer.value.toggle(image));
</script>
