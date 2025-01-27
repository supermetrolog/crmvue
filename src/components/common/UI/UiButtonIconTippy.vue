<template>
    <Tippy>
        <template #default>
            <UiButtonIcon
                @click="$emit('schedule-call')"
                :active
                :small
                class="messenger-quiz-contact__button"
            >
                <slot name="icon">
                    <i :class="icon" />
                </slot>
            </UiButtonIcon>
        </template>
        <template #content>
            <slot name="content" />
        </template>
    </Tippy>
</template>
<script setup>
import { Tippy } from 'vue-tippy';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';

defineProps({
    label: String,
    active: Boolean,
    small: Boolean,
    icon: String
});
</script>
