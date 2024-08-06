<template>
    <AnimationTransition :speed="0.5">
        <HoverActionsButton
            v-show="visible"
            v-tippy="'Пролистать до конца'"
            @click="emit('scroll')"
            class="messenger-chat__scroll-button"
        >
            <i class="fa-solid fa-chevron-down" />
        </HoverActionsButton>
    </AnimationTransition>
</template>
<script setup>
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';

const emit = defineEmits(['scroll']);
defineProps({ visible: { type: Boolean, default: false } });
</script>
