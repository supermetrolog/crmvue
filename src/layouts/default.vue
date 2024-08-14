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
            <Confirm />
            <PhoneNumberPopup />
        </teleport>
    </div>
</template>

<script setup>
import TheSideBar from '@/components/SideBar/TheSideBar.vue';
import TheHeader from '@/components/Header/TheHeader.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import Messenger from '@/components/Messenger/Messenger.vue';
import Previewer from '@/components/common/Previewer.vue';
import { useStore } from 'vuex';
import Confirm from '@/components/common/Confirm.vue';
import PhoneNumberPopup from '@/components/common/PhoneNumberPopup.vue';
import ConfettiExplosion from 'vue-confetti-explosion';
import { computed, provide, ref } from 'vue';
import { useConfetti } from '@/composables/useConfetti.js';

const store = useStore();
const { isVisible: confettiIsVisible, duration } = useConfetti();

const messenger = ref(null);
const previewer = ref(null);

const THIS_USER = computed(() => store.getters.THIS_USER);

provide('$openPreviewer', image => previewer.value.toggle(image));
provide('$openMessengerChat', ({ companyID = null, objectID = null, chatMemberID = null }) => {
    if (chatMemberID) messenger.value.openChatByID(chatMemberID);
    else if (companyID !== null && objectID === null)
        messenger.value.openChatByCompanyID(companyID);
    else messenger.value.openChat(companyID, objectID);
});
</script>
