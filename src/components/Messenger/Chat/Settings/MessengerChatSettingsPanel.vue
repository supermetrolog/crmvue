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
<script>
import MessengerChatSettingsPhotos from '@/components/Messenger/Chat/Settings/MessengerChatSettingsPhotos.vue';
import MessengerChatSettingsFiles from '@/components/Messenger/Chat/Settings/MessengerChatSettingsFiles.vue';
import MessengerChatSettingsQuizzes from '@/components/Messenger/Chat/Settings/MessengerChatSettingsQuizzes.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
export default {
    name: 'MessengerChatSettingsPanel',
    components: {
        AnimationTransition,
        MessengerChatSettingsFiles,
        MessengerChatSettingsPhotos,
        MessengerChatSettingsQuizzes
    },
    emits: ['update:modelValue'],
    props: {
        modelValue: {
            type: String,
            default: null
        }
    },
    computed: {
        panelName() {
            return 'MessengerChatSettings' + this.$formatter.text().ucFirst(this.modelValue);
        }
    },
    methods: {
        close() {
            this.$emit('update:modelValue', null);
        }
    }
};
</script>
