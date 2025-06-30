<template>
    <div
        class="empty"
        :class="{ 'empty--no-rounded': noRounded, 'empty--transparent': transparent }"
    >
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
    },
    transparent: Boolean
});
</script>
