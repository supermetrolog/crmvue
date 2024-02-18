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
        <div v-if="deals.length" class="ObjectDeals-list">
            <ComplexDealPreview
                v-for="deal in deals"
                :key="deal.id"
                @choose="choseDeal"
                :deal="deal"
                :is-current="currentDealId === deal.id"
            />
        </div>
        <AnimationTransition fast>
            <ComplexDealItem
                v-if="currentDealId"
                :key="currentDealId"
                :floors="sortedCurrentDealFloors"
                :deal="currentDeal"
                :object="object"
            />
        </AnimationTransition>
    </div>
</template>

<script>
import ComplexDealPreview from '@/components/Complex/Deal/ComplexDealPreview.vue';
import ComplexDealItem from '@/components/Complex/Deal/ComplexDealItem.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

export default {
    name: 'ComplexDeals',
    components: { AnimationTransition, ComplexDealItem, ComplexDealPreview },
    props: {
        deals: {
            type: Array,
            required: true
        },
        floors: {
            type: Array,
            required: true
        },
        object: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            currentDealId: null
        };
    },
    computed: {
        currentDeal() {
            return this.deals.find(deal => deal.id === this.currentDealId);
        },
        sortedCurrentDealFloors() {
            // eslint-disable-next-line no-undef
            const floors = structuredClone(this.floors);

            floors.forEach(floor => {
                floor.parts = floor.parts.filter(part => part.offer_id === this.currentDeal.id);
            });

            floors.sort((first, second) => second.number.order_row - first.number.order_row);

            return floors;
        }
    },
    methods: {
        choseDeal(id) {
            this.currentDealId = this.currentDealId === id ? null : id;
        }
    },
    mounted() {
        if (
            this.$route.query.offer_id &&
            this.deals.find(deal => deal.id == this.$route.query.offer_id)
        ) {
            this.currentDealId = Number(this.$route.query.offer_id);
        }
    }
};
</script>
