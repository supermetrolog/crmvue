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
            <Confirm />
            <PhoneNumberPopup />
        </teleport>
    </div>
</template>

<script>
import TheSideBar from '@/components/SideBar/TheSideBar.vue';
import TheHeader from '@/components/Header/TheHeader.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import Messenger from '@/components/Messenger/Messenger.vue';
import Previewer from '@/components/common/Previewer.vue';
import { mapGetters } from 'vuex';
import Confirm from '@/components/common/Confirm.vue';
import PhoneNumberPopup from '@/components/common/PhoneNumberPopup.vue';
import TheMobileHeader from '@/components/Header/TheMobileHeader.vue';
import TheMobileSidebar from '@/components/SideBar/TheMobileSidebar.vue';

export default {
    name: 'Mobile',
    components: {
        TheMobileSidebar,
        TheMobileHeader,
        PhoneNumberPopup,
        Confirm,
        Previewer,
        Messenger,
        AnimationTransition,
        TheHeader,
        TheSideBar
    },
    provide() {
        return {
            $openPreviewer: image => this.$refs.previewer.toggle(image),
            $openMessengerChat: ({ companyID, objectID, chatMemberID }) => {
                if (chatMemberID) this.$refs.messenger.openChatByID(chatMemberID);
                else this.$refs.messenger.openChat(companyID, objectID);
            }
        };
    },
    computed: {
        ...mapGetters(['THIS_USER'])
    }
};
</script>
