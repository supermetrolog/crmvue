<template>
    <div class="v-main-layout">
        <TheSideBar />
        <TheHeader />
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
            <MapPreviewer ref="mapPreviewer" />
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
import MapPreviewer from '@/components/common/MapPreviewer.vue';
import { useStore } from 'vuex';
import { computed, useTemplateRef } from 'vue';
import PopupsWrapper from '@/components/common/PopupsWrapper.vue';
import { createMessengerContext } from '@/components/Messenger/useMessenger.js';
import MessengerOpeningLoader from '@/components/Messenger/MessengerOpeningLoader.vue';
import { createPreviewer } from '@/composables/usePreviewer.js';
import { useActivityTracking } from '@/composables/useActivityTracking/useActivityTracking.js';
import { createMapPreviewer } from '@/composables/useMapPreviewer.js';

const store = useStore();
useActivityTracking();

const messenger = useTemplateRef('messenger');
const previewer = useTemplateRef('previewer');
const mapPreviewer = useTemplateRef('mapPreviewer');

const THIS_USER = computed(() => store.getters.THIS_USER);

const { isOpening } = createMessengerContext(messenger);

const preview = (image, id = null) => previewer.value.toggle(image, id);
createPreviewer(preview);

const previewInMap = (payload = {}) => mapPreviewer.value.open(payload);
createMapPreviewer(previewInMap);
</script>
