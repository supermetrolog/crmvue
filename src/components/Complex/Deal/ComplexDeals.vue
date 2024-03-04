<template>
    <div class="object-deals">
        <!-- первая узкая белая панель вверху -->
        <div class="object-deals-actions">
            <ul class="object-deals-actions__list">
                <li>
                    <Button icon small>
                        <i class="fa-solid fa-plus"></i>
                        <span>Аренда</span>
                    </Button>
                </li>
                <li>
                    <Button icon small>
                        <i class="fa-solid fa-plus"></i>
                        <span>Субаренда</span>
                    </Button>
                </li>
                <li>
                    <Button icon small>
                        <i class="fa-solid fa-plus"></i>
                        <span>Продажа</span>
                    </Button>
                </li>
                <li>
                    <Button icon small>
                        <i class="fa-solid fa-plus"></i>
                        <span>Ответ-хранение</span>
                    </Button>
                </li>
            </ul>
        </div>
        <div v-if="deals.length" class="object-deals__list">
            <ComplexDealPreview
                v-for="deal in deals"
                :key="deal.id"
                @choose="choseDeal"
                :deal="deal"
                :is-current="currentDealId === deal.id"
            />
        </div>
        <EmptyData v-else>Список сделок пуст..</EmptyData>
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
import Button from '@/components/common/Button.vue';
import EmptyData from '@/components/common/EmptyData.vue';

export default {
    name: 'ComplexDeals',
    components: { EmptyData, Button, AnimationTransition, ComplexDealItem, ComplexDealPreview },
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
