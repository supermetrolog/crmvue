<template>
    <div class="messenger-quiz__footer">
        <UiButton
            @click="$emit('complete')"
            color="success"
            :disabled
            icon="fa-solid fa-check"
            bolder
        >
            Сохранить опрос
        </UiButton>
    </div>
</template>
<script setup>
import UiButton from '@/components/common/UI/UiButton.vue';

defineEmits(['complete']);
defineProps({
    disabled: Boolean
});
</script>
