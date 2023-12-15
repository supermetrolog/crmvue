<template>
    <Button @click="$emit('click')" icon title="Обновить">
        <span>Обновить</span>
        <i class="fa-solid fa-rotate"></i>
    </Button>
</template>

<script>
import Button from '@/components/common/Button.vue';

export default {
    name: 'RefreshButton',
    components: { Button }
};
</script>