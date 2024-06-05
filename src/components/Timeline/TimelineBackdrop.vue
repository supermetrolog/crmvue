<template>
    <div class="timeline-backdrop">
        <div class="timeline-backdrop__message">
            <p class="timeline-backdrop__title">Таймлайн не активен</p>
            <Button @click="$emit('close')" success small>Скрыть предупреждение</Button>
        </div>
    </div>
</template>
<script>
import Button from '@/components/common/Button.vue';

export default {
    name: 'TimelineBackdrop',
    components: { Button }
};
</script>
