<template>
    <div class="v-main-layout">
        <TheSideBar />
        <TheHeader />
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
            <Confirmer ref="confirmer" />
        </teleport>
    </div>
</template>

<script>
import TheSideBar from '@/components/SideBar/TheSideBar.vue';
import TheHeader from '@/components/Header/TheHeader.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import Messenger from '@/components/Messenger/Messenger.vue';
import Previewer from '@/components/common/Previewer.vue';
import Confirmer from '@/components/common/Confirmer.vue';
import { mapGetters } from 'vuex';

export default {
    name: 'Default',
    components: {
        Confirmer,
        Previewer,
        Messenger,
        AnimationTransition,
        TheHeader,
        TheSideBar
    },
    provide() {
        return {
            $openPreviewer: image => this.$refs.previewer.toggle(image),
            $openMessengerChat: (companyID, offerID) =>
                this.$refs.messenger.openChat(companyID, offerID),
            $confirmPopup: async text => this.$refs.confirmer.open(text)
        };
    },
    computed: {
        ...mapGetters(['THIS_USER'])
    }
};
</script>
