<template>
    <div class="messenger-chat-message-addition" :class="{ viewed: settingsIsVisible }">
        <div v-if="$slots.header" class="messenger-chat-message-addition__header">
            <slot name="header" />
        </div>
        <div class="messenger-chat-message-addition__content">
            <div v-if="$slots.functions" class="messenger-chat-message-addition__functions">
                <slot name="functions"></slot>
            </div>
            <div
                ref="iconEl"
                @click.stop="clickToIconHandler"
                class="messenger-chat-message-addition__trigger"
            >
                <slot name="icon"></slot>
            </div>
            <div v-if="$slots.additionalIcons" class="messenger-chat-message-addition__icons">
                <slot name="additionalIcons"></slot>
            </div>
            <p class="messenger-chat-message-addition__text">
                <slot name="content"></slot>
            </p>
            <div v-if="$slots.external" class="messenger-chat-message-addition__external">
                <slot name="external"></slot>
            </div>
        </div>
        <AnimationTransition v-if="$slots.actions" :speed="0.5">
            <div
                v-if="settingsIsVisible"
                v-on-click-outside="clickOutside"
                class="messenger-chat-message-addition-settings"
            >
                <slot name="actions"></slot>
            </div>
        </AnimationTransition>
    </div>
</template>
<script setup>
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { shallowRef, useSlots } from 'vue';
import { vOnClickOutside } from '@vueuse/components';

const slots = useSlots();

const settingsIsVisible = shallowRef(false);
const iconEl = shallowRef(null);

const clickOutside = [
    () => {
        settingsIsVisible.value = false;
    },
    { ignore: [iconEl] }
];

const clickToIconHandler = () => {
    if (slots.actions) settingsIsVisible.value = !settingsIsVisible.value;
};
</script>
