<template>
    <div class="messenger-chat-message-addition" :class="{ viewed: settingsIsVisible }">
        <div class="messenger-chat-message-addition__content">
            <slot name="icon"></slot>
            <p class="messenger-chat-message-addition__text">
                <slot name="content"></slot>
            </p>
            <span
                @click.stop="settingsIsVisible = !settingsIsVisible"
                class="messenger-chat-message-addition__settings"
            >
                <i class="fa-solid fa-ellipsis-vertical"></i>
            </span>
        </div>
        <AnimationTransition :speed="0.5">
            <div v-if="settingsIsVisible" class="messenger-chat-message-addition-settings">
                <slot name="actions"></slot>
            </div>
        </AnimationTransition>
    </div>
</template>
<script>
import AnimationTransition from '@/components/common/AnimationTransition.vue';

export default {
    name: 'MessengerChatMessageAdditionsItem',
    components: { AnimationTransition },
    data() {
        return {
            settingsIsVisible: false
        };
    },
    watch: {
        settingsIsVisible(newValue) {
            if (newValue) document.addEventListener('click', this.settingsClickHandler);
            else document.removeEventListener('click', this.settingsClickHandler);
        }
    },
    methods: {
        settingsClickHandler() {
            this.settingsIsVisible = false;
        }
    }
};
</script>
