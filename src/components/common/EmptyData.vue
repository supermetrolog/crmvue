<template>
    <div class="empty">
        <img height="125px" :src="require('@/assets/image/empty.gif')" alt="" />
        <p class="empty__text">
            <slot>Данные отсутствуют..</slot>
        </p>
    </div>
</template>
<script>
export default {
    name: 'EmptyData'
};
</script>
