<template>
    <UiField color="light accordion-simple-trigger-button">
        <div
            class="d-flex justify-content-center align-items-center gap-2 justify-content-center w-100 c-pointer"
        >
            <span>{{ label }}</span>
            <div
                v-tippy="`Нажмите, чтобы ${opened ? 'скрыть' : 'посмотреть'} содержимое`"
                class="accordion-simple__icon"
            >
                <i v-if="opened" class="fas fa-angle-up"></i>
                <i v-else class="fas fa-angle-down"></i>
            </div>
        </div>
    </UiField>
</template>
<script setup>
import UiField from '@/components/common/UI/UiField.vue';

defineProps({
    label: String,
    opened: Boolean
});
</script>
