<template>
    <div class="empty" :class="{ 'empty--no-rounded': noRounded }">
        <slot name="image">
            <img :src="require('@/assets/image/empty.gif')" alt="" />
        </slot>
        <p class="empty__text">
            <slot>Данные отсутствуют..</slot>
        </p>
    </div>
</template>
<script>
export default {
    name: 'EmptyData',
    props: {
        noRounded: {
            type: Boolean,
            default: false
        }
    }
};
</script>
