<template>
    <div class="messenger-quiz__footer">
        <MessengerButton @click="$emit('complete')" color="success" :disabled>
            Готово
        </MessengerButton>
    </div>
</template>
<script setup>
import MessengerButton from '@/components/Messenger/MessengerButton.vue';

defineEmits(['complete']);
defineProps({
    disabled: Boolean
});
</script>
