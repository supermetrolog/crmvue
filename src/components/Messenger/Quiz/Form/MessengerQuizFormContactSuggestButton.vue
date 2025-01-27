<template>
    <div class="messenger-quiz-form__suggest-button">
        <MessengerButton @click="$emit('click')" color="success" class="mt-2 mx-auto" small>
            <i class="fa-solid fa-plus" />
            <span>Выбрать другого контакта..</span>
        </MessengerButton>
    </div>
</template>
<script setup>
import MessengerButton from '@/components/Messenger/MessengerButton.vue';

defineEmits(['click']);
</script>
