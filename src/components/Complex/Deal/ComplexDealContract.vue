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
<script>
import { entityOptions } from '@/const/options/options';

export default {
    name: 'ComplexDealContract',
    props: {
        type: Number
    },
    computed: {
        isExclusive() {
            return this.type === entityOptions.deal.contractTypeStatement.EXCLUSIVE;
        }
    }
};
</script>
