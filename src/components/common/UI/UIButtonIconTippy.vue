<template>
    <Tippy>
        <template #default>
            <UIButtonIcon
                @click="$emit('schedule-call')"
                :active
                :small
                class="messenger-quiz-contact__button"
            >
                <slot name="icon">
                    <i :class="icon" />
                </slot>
            </UIButtonIcon>
        </template>
        <template #content>
            <slot name="content" />
        </template>
    </Tippy>
</template>
<script setup>
import { Tippy } from 'vue-tippy';
import UIButtonIcon from '@/components/common/UI/UIButtonIcon.vue';

defineProps({
    label: String,
    active: Boolean,
    small: Boolean,
    icon: String
});
</script>
