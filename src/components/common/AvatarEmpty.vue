<template>
    <div v-tippy="contact" class="avatar avatar--empty" :style="{ '--size': size + 'px' }">
        {{ initials }}
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { toInitialsFormat } from '@/utils/formatter.js';

const props = defineProps({
    size: {
        type: [String, Number],
        default: 40
    },
    contact: {
        type: String,
        default: undefined
    }
});

const initials = computed(() => toInitialsFormat(props.contact));
</script>
