<template>
    <div class="object-holding-chat">
        <div
            ref="chatButton"
            v-tippy="`Открыть в чате (выбор из ${queue.length} объектов)`"
            @click="listIsOpen = !listIsOpen"
            class="object-holding-chat__button"
            :class="{ active: listIsOpen }"
        >
            <i class="fa-solid fa-comment" />
        </div>
        <AnimationTransition :speed="0.5">
            <div
                v-if="listIsOpen"
                v-on-click-outside="clickOutside"
                class="object-holding-chat__list"
            >
                <b>Выберите объект</b>
                <TransitionGroup name="list">
                    <Button
                        v-for="element in queue"
                        :key="element"
                        v-element-hover="$event => onHover(element, $event)"
                        @click="$emit('open', element)"
                        i
                    >
                        Объект #{{ element }}
                    </Button>
                </TransitionGroup>
            </div>
        </AnimationTransition>
    </div>
</template>

<script setup>
import Button from '@/components/common/Button.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { ref, shallowRef } from 'vue';
import { vOnClickOutside, vElementHover } from '@vueuse/components';

const modelValueTarget = defineModel('target', { type: Number, default: null });
defineEmits(['open']);
defineProps({
    queue: {
        type: Array,
        required: true
    }
});

const chatButton = ref(null);
const listIsOpen = shallowRef(false);

const clickOutside = [
    () => {
        listIsOpen.value = false;
    },
    { ignore: [chatButton] }
];

const onHover = (objectID, isHovered) => {
    modelValueTarget.value = isHovered ? objectID : null;
};
</script>
<style>
.list-enter-active,
.list-leave-active {
    transition: all 1s ease;
}
.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>
