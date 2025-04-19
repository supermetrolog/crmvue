<template>
    <div
        class="mini-timeline__step col"
        :class="[
            origin
                ? {
                      done: isCompleted,
                      'in-process': inProcess,
                      attention: hasAttention
                  }
                : undefined
        ]"
    >
        <div class="mini-timeline__arrow mini-timeline__arrow--top"></div>
        <div class="mini-timeline__step-content">
            <span class="mini-timeline__step-name">
                <span class="mr-2">{{ label }}</span>
                <i
                    v-if="origin"
                    class="fas icon"
                    :class="{
                        'fa-check-circle': isCompleted,
                        'fa-hourglass-half': inProcess,
                        'fa-exclamation': hasAttention
                    }"
                ></i>
            </span>
        </div>
        <div class="mini-timeline__arrow mini-timeline__arrow--bottom"></div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    label: { type: String, required: true },
    origin: Object
});

const isCompleted = computed(() => props.origin.status === 1);
const inProcess = computed(() => props.origin.status === 0);
const hasAttention = computed(() => props.origin.status === 2);
</script>
