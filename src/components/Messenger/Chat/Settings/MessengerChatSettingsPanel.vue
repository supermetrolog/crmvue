<template>
    <div class="messenger-chat-settings__panel" :class="{ active: !!modelValue }">
        <AnimationTransition
            :animation="{ enter: 'fadeInRight', leave: 'fadeOutRight' }"
            :speed="0.7"
        >
            <component :is="panelName" v-if="!!modelValue" @close="close" />
        </AnimationTransition>
    </div>
</template>
<script setup>
import MessengerChatSettingsPhotos from '@/components/Messenger/Chat/Settings/MessengerChatSettingsPhotos.vue';
import MessengerChatSettingsFiles from '@/components/Messenger/Chat/Settings/MessengerChatSettingsFiles.vue';
import MessengerChatSettingsQuizzes from '@/components/Messenger/Chat/Settings/MessengerChatSettingsQuizzes.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { computed } from 'vue';
import { ucFirst } from '@/utils/formatter.js';

defineOptions({
    components: {
        MessengerChatSettingsPhotos,
        MessengerChatSettingsFiles,
        MessengerChatSettingsQuizzes
    }
});
const modelValue = defineModel({ type: String, default: null });

const close = () => {
    modelValue.value = null;
};

const panelName = computed(() => 'MessengerChatSettings' + ucFirst(modelValue.value));
</script>
