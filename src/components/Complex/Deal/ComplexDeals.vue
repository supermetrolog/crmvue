<template>
    <div class="object-deals">
        <div class="object-deals-actions">
            <ul class="object-deals-actions__list">
                <li>
                    <Button info icon small>
                        <i class="fa-solid fa-plus"></i>
                        <span>Аренда</span>
                    </Button>
                </li>
                <li>
                    <Button info icon small>
                        <i class="fa-solid fa-plus"></i>
                        <span>Субаренда</span>
                    </Button>
                </li>
                <li>
                    <Button info icon small>
                        <i class="fa-solid fa-plus"></i>
                        <span>Продажа</span>
                    </Button>
                </li>
                <li>
                    <Button info icon small>
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
        <AnimationTransition :speed="0.1">
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

<script setup>
import ComplexDealPreview from '@/components/Complex/Deal/ComplexDealPreview.vue';
import ComplexDealItem from '@/components/Complex/Deal/ComplexDealItem.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import Button from '@/components/common/Button.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import { cloneObject } from '@/utils/index.js';
import { computed, onMounted, shallowRef } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const props = defineProps({
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
});

const currentDealId = shallowRef(null);

const currentDeal = computed(() => props.deals.find(deal => deal.id === currentDealId.value));
const sortedCurrentDealFloors = computed(() => {
    const floors = cloneObject(props.floors);

    floors.forEach(floor => {
        floor.parts = floor.parts.filter(part => part.offer_id === currentDeal.value.id);
    });

    floors.sort((first, second) => second.number.order_row - first.number.order_row);

    return floors;
});

const choseDeal = id => {
    currentDealId.value = currentDealId.value === id ? null : id;
};

onMounted(() => {
    if (route.query.offer_id && props.deals.some(deal => deal.id === Number(route.query.offer_id)))
        currentDealId.value = Number(route.query.offer_id);
});
</script>
