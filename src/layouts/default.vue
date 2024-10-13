<template>
    <div class="v-main-layout">
        <TheSideBar />
        <TheHeader />
        <div v-if="confettiIsVisible" class="v-main-layout__confetti">
            <ConfettiExplosion :duration="duration" />
        </div>
        <!-- <CallerManager /> -->
        <main>
            <router-view v-slot="{ Component }">
                <AnimationTransition :speed="0.1">
                    <component :is="Component"></component>
                </AnimationTransition>
            </router-view>
        </main>
        <Messenger v-if="THIS_USER" ref="messenger" />
        <teleport to="body">
            <MessengerOpeningLoader :show="isOpening" />
            <Previewer ref="previewer" />
        </teleport>
        <PopupsWrapper />
    </div>
</template>

<script setup>
import TheSideBar from '@/components/SideBar/TheSideBar.vue';
import TheHeader from '@/components/Header/TheHeader.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import Messenger from '@/components/Messenger/Messenger.vue';
import Previewer from '@/components/common/Previewer.vue';
import { useStore } from 'vuex';
import ConfettiExplosion from 'vue-confetti-explosion';
import { computed, provide, shallowRef } from 'vue';
import { useConfetti } from '@/composables/useConfetti.js';
import PopupsWrapper from '@/components/common/PopupsWrapper.vue';
import { createMessengerContext } from '@/components/Messenger/useMessenger.js';
import MessengerOpeningLoader from '@/components/Messenger/MessengerOpeningLoader.vue';

const store = useStore();
const { isVisible: confettiIsVisible, duration } = useConfetti();

const messenger = shallowRef(null);
const previewer = shallowRef(null);

const THIS_USER = computed(() => store.getters.THIS_USER);

const { isOpening } = createMessengerContext(messenger);
provide('$openPreviewer', image => previewer.value.toggle(image));
</script>
