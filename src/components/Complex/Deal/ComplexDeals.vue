<template>
    <div class="ObjectDeals">
        <!-- первая узкая белая панель вверху -->
        <div class="ObjectDeals-actions">
            <p class="ObjectDeals-actions-label">Создать сделку:</p>
            <ul class="ObjectDeals-actions-list">
                <li class="ObjectDeals-actions-item">
                    <button class="ObjectDeals-actions-button">аренда</button>
                </li>
                <li class="ObjectDeals-actions-item">
                    <button class="ObjectDeals-actions-button">субаренда</button>
                </li>
                <li class="ObjectDeals-actions-item">
                    <button class="ObjectDeals-actions-button">продажа</button>
                </li>
                <li class="ObjectDeals-actions-item">
                    <button class="ObjectDeals-actions-button">ответ-хранение</button>
                </li>
            </ul>
        </div>
        <!--        <div v-if="deals.length" class="ObjectDeals-list">-->
        <!--            <ComplexDealPreview-->
        <!--                v-for="deal in deals"-->
        <!--                :key="deal.id"-->
        <!--                @choose="choseDeal"-->
        <!--                :deal="deal"-->
        <!--                :is-current="currentDealId === deal.id"-->
        <!--            />-->
        <!--        </div>-->
        <!--        <ComplexDealItem v-if="currentDeal" :object="object" :deal="currentDeal" />-->
    </div>
</template>

<script>
export default {
    name: 'ComplexDeals',
    props: {
        deals: {
            type: Array,
            default: () => []
        },
        object: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            currentDealId: this.deals[0] ? this.deals[0] : null
        };
    },
    computed: {
        currentDeal() {
            return this.deals.find(deal => deal.id === this.currentDealId);
        }
    },
    methods: {
        choseDeal(id) {
            this.currentDealId = id;
        }
    }
};
</script>
