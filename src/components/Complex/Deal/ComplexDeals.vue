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
                    <button class="ObjectDeals-actions-button">
                        ответ-хранение
                    </button>
                </li>
            </ul>
        </div>
        <div class="ObjectDeals-list">
            <ComplexDealPreview
                @choose="choseDeal"
                v-for="deal in deals"
                :key="deal.id"
                :deal="deal"
                :isCurrent="currentDealId === deal.id"
            />
        </div>
        <ComplexDealItem :object="object" :deal="currentDeal"/>
    </div>
</template>

<script>
import {mapActions} from 'vuex';
import ComplexDealPreview from "@/components/Complex/Deal/ComplexDealPreview.vue";
import ComplexDealItem from "@/components/Complex/Deal/ComplexDealItem.vue";

export default {
    name: "ComplexDeals",
    components: {
        ComplexDealItem,
        ComplexDealPreview
    },
    props: {
        deals: {
            type: Array,
            required: true
        },
        object: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            currentDealId: this.deals[0].id,
        };
    },
    computed: {
        currentDeal() {
            return this.deals.find((deal) => deal.id === this.currentDealId);
        }
    },
    methods: {
        choseDeal(id) {
            this.currentDealId = id;
        },
        ...mapActions('Complex', ['FETCH_COMPLEX'])
    },

    mounted() {
        this.FETCH_COMPLEX();

    },


}
</script>
