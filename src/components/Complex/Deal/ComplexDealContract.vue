<template>
    <div class="deal-info__block deal-info-contract">
        <p v-if="isExclusive" class="deal-info-contract__item deal-info-contract__item--exclusive">
            <i class="fa-solid fa-champagne-glasses"></i>
            <span>Подписан эксклюзив</span>
        </p>
        <p v-else class="deal-info-contract__item">
            <i class="fa-solid fa-file-signature"></i>
            <span>Подписан обычный контракт</span>
        </p>
    </div>
</template>
<script setup>
import { entityOptions } from '@/const/options/options';
import { computed } from 'vue';

const props = defineProps({
    type: Number
});

const isExclusive = computed(() => {
    return props.type === entityOptions.deal.contractTypeStatement.EXCLUSIVE;
});
</script>
