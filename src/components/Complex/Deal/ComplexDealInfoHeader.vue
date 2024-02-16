<template>
    <div class="deal-info-header">
        <p class="deal-info-header__title">Сводка по сделке</p>
        <p class="deal-info-header__text">
            <i class="fas fa-walking"></i>
            <span> [Брокер] </span>
            <span v-if="visited === 1" class="deal-info-header__text_size_small"
                >/ Личное посещение</span
            >
        </p>
    </div>
</template>

<script>
export default {
    name: 'ComplexDealInfoHeader',
    components: {},
    props: {
        consultant: {
            type: Object
        },
        visited: {
            type: [Number, Boolean],
            default: false
        }
    }
};
</script>
