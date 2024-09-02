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
import { computed, provide, ref } from 'vue';
import { useConfetti } from '@/composables/useConfetti.js';
import PopupsWrapper from '@/components/common/PopupsWrapper.vue';

const store = useStore();
const { isVisible: confettiIsVisible, duration } = useConfetti();

const messenger = ref(null);
const previewer = ref(null);

const THIS_USER = computed(() => store.getters.THIS_USER);

provide('$openPreviewer', image => previewer.value.toggle(image));
provide(
    '$openMessengerChat',
    async ({ companyID = null, objectID = null, chatMemberID = null, modelType = 'object' }) => {
        if (chatMemberID) return await messenger.value.openChatByID(chatMemberID);
        else if (companyID !== null && objectID === null)
            return await messenger.value.openChatByCompanyID(companyID);
        else {
            return await messenger.value.openChat(companyID, objectID, modelType);
        }
    }
);
</script>
