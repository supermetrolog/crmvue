<template>
    <div class="d-flex gap-2 flex-wrap">
        <Button
            v-tippy="'Нажмите, чтобы сохранить ваш результат'"
            @click="$emit('done')"
            :disabled="disabled || !objectsLength"
            success
            solid
            icon
        >
            <span>Готово</span>
            <i class="fa-solid fa-check icon"></i>
        </Button>
        <Button
            v-tippy="'В случае нахождения более подходящих предложений вам придет уведомление!'"
            @click="$emit('negative')"
            :active="isNegative"
            :disabled="disabled"
            danger
            solid
            icon
        >
            <span>Нет подходящих</span>
            <i class="fa-solid fa-frown-open icon"></i>
        </Button>
    </div>
</template>
<script>
import Button from '@/components/common/Button.vue';

export default {
    name: 'TimelineStepDefaultButtons',
    components: { Button },
    emits: ['negative', 'done'],
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        objectsLength: {
            type: Number,
            default: 0
        },
        isNegative: {
            type: Boolean,
            default: false
        }
    }
};
</script>
