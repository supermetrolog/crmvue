<template>
    <div class="offer-table-item__relations h-100">
        <button
            v-if="hasRentOffers"
            v-tippy="{
                content:
                    currentTab === dealOptions.typeStatement.RENT
                        ? 'Нажмите, чтобы скрыть предложения снизу.'
                        : 'По этому объекту имеются предложения по аренде. Нажмите, чтобы просмотреть их.',
                hideOnClick: false
            }"
            @click="$emit('open', dealOptions.typeStatement.RENT)"
            class="offer-table-item__relation-button offer-table-item__relation-button--rent"
            :class="{ active: currentTab === dealOptions.typeStatement.RENT }"
        >
            <i class="fa-solid fa-caret-up"></i>
            <span>Аренда</span>
            <i
                class="fa-solid offer-table-item__relation-icon"
                :class="{
                    'fa-eye-slash': currentTab === dealOptions.typeStatement.RENT,
                    'fa-eye': currentTab !== dealOptions.typeStatement.RENT
                }"
            />
        </button>
        <button
            v-if="hasSaleOffers"
            v-tippy="{
                content:
                    currentTab === dealOptions.typeStatement.SALE
                        ? 'Нажмите, чтобы скрыть предложения снизу.'
                        : 'По этому объекту имеются предложения по продаже. Нажмите, чтобы просмотреть их.',
                hideOnClick: false
            }"
            @click="$emit('open', dealOptions.typeStatement.SALE)"
            class="offer-table-item__relation-button offer-table-item__relation-button--sale"
            :class="{ active: currentTab === dealOptions.typeStatement.SALE }"
        >
            <i class="fa-solid fa-caret-up"></i>
            <span>Продажа</span>
            <i
                class="fa-solid offer-table-item__relation-icon"
                :class="{
                    'fa-eye-slash': currentTab === dealOptions.typeStatement.SALE,
                    'fa-eye': currentTab !== dealOptions.typeStatement.SALE
                }"
            />
        </button>
        <button
            v-if="hasStorageOffers"
            v-tippy="{
                content:
                    currentTab === dealOptions.typeStatement.STORAGE
                        ? 'Нажмите, чтобы скрыть предложения снизу.'
                        : 'По этому объекту имеются предложения по ответ.хранению. Нажмите, чтобы просмотреть их.',
                hideOnClick: false
            }"
            @click="$emit('open', dealOptions.typeStatement.STORAGE)"
            class="offer-table-item__relation-button offer-table-item__relation-button--storage"
            :class="{ active: currentTab === dealOptions.typeStatement.STORAGE }"
        >
            <i class="fa-solid fa-caret-up"></i>
            <span>Ответ.хран</span>
            <i
                class="fa-solid offer-table-item__relation-icon"
                :class="{
                    'fa-eye-slash': currentTab === dealOptions.typeStatement.STORAGE,
                    'fa-eye': currentTab !== dealOptions.typeStatement.STORAGE
                }"
            />
        </button>
        <button
            v-if="hasSubleaseOffers"
            v-tippy="{
                content:
                    currentTab === dealOptions.typeStatement.SUBLEASE
                        ? 'Нажмите, чтобы скрыть предложения снизу.'
                        : 'По этому объекту имеются предложения по субаренде. Нажмите, чтобы просмотреть их.',
                hideOnClick: false
            }"
            @click="$emit('open', dealOptions.typeStatement.SUBLEASE)"
            class="offer-table-item__relation-button offer-table-item__relation-button--sublease"
            :class="{ active: currentTab === dealOptions.typeStatement.SUBLEASE }"
        >
            <i class="fa-solid fa-caret-up"></i>
            <span>Субаренда</span>
            <i
                class="fa-solid offer-table-item__relation-icon"
                :class="{
                    'fa-eye-slash': currentTab === dealOptions.typeStatement.SUBLEASE,
                    'fa-eye': currentTab !== dealOptions.typeStatement.SUBLEASE
                }"
            />
        </button>
    </div>
</template>

<script setup>
import { dealOptions } from '@/const/options/deal.options.js';
import { computed } from 'vue';

defineEmits(['open']);
const props = defineProps({
    offers: {
        type: Array,
        default: () => []
    },
    current: {
        type: Number,
        required: true
    },
    currentTab: {
        type: Number,
        default: null
    }
});

const hasRentOffers = computed(() =>
    props.offers.some(
        element =>
            element.deal_type === dealOptions.typeStatement.RENT && element.id !== props.current
    )
);
const hasSaleOffers = computed(() =>
    props.offers.some(
        element =>
            element.deal_type === dealOptions.typeStatement.SALE && element.id !== props.current
    )
);
const hasStorageOffers = computed(() =>
    props.offers.some(
        element =>
            element.deal_type === dealOptions.typeStatement.STORAGE && element.id !== props.current
    )
);
const hasSubleaseOffers = computed(() =>
    props.offers.some(
        element =>
            element.deal_type === dealOptions.typeStatement.SUBLEASE && element.id !== props.current
    )
);
</script>
