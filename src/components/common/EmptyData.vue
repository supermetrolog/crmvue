<template>
    <div class="empty" :class="{ 'empty--no-rounded': noRounded }">
        <slot name="image">
            <img src="@/assets/image/empty.gif" alt="" />
        </slot>
        <p class="empty__text">
            <slot>Данные отсутствуют..</slot>
        </p>
        <slot name="actions" />
    </div>
</template>
<script setup>
defineProps({
    noRounded: {
        type: Boolean,
        default: false
    }
});
</script>
