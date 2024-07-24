<template>
    <Button @click="$emit('click')" icon title="Обновить">
        <span>Обновить</span>
        <i class="fa-solid fa-rotate"></i>
    </Button>
</template>

<script setup>
import Button from '@/components/common/Button.vue';

defineEmits(['click']);
</script>
