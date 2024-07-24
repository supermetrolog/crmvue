<template>
    <tr class="offer-table-item-dropdown">
        <td colspan="12" class="offer-table-item-dropdown__wrapper">
            <Tabs closed :cache-lifetime="0" with-transition>
                <Tab
                    id="first-tab"
                    nav-item-class="offer-table-item-dropdown__center"
                    :name="`<p>S - ${objectType}</p><p>${areaBuilding} <small>м<sup>2</sup></small></p>`"
                >
                    <div class="offer-table-item-dropdown__list">
                        <OfferTableItemObject :object="offer.object" />
                    </div>
                </Tab>
                <Tab
                    id="second-tab"
                    :is-disabled="!hasRentOffers"
                    name="Аренда"
                    :suffix="rentOffersSuffix"
                >
                    <div class="offer-table-item-dropdown__list">
                        <OfferTableRelativeItem
                            v-for="offer in preparedOffers.rent.active"
                            :key="offer.id"
                            :offer="offer"
                        />
                        <OfferTableRelativeItem
                            v-for="offer in preparedOffers.rent.passive"
                            :key="offer.id"
                            :offer="offer"
                        />
                    </div>
                </Tab>
                <Tab
                    id="third-tab"
                    :is-disabled="!hasRentOffers"
                    name="Субаренда"
                    :suffix="subleaseOffersSuffix"
                >
                    <div class="offer-table-item-dropdown__list">
                        <OfferTableRelativeItem
                            v-for="offer in preparedOffers.sublease.active"
                            :key="offer.id"
                            :offer="offer"
                        />
                        <OfferTableRelativeItem
                            v-for="offer in preparedOffers.sublease.passive"
                            :key="offer.id"
                            :offer="offer"
                        />
                    </div>
                </Tab>
                <Tab
                    id="fourth-tab"
                    :is-disabled="!hasSaleOffers"
                    name="Продажа"
                    :suffix="saleOffersSuffix"
                >
                    <div class="offer-table-item-dropdown__list">
                        <OfferTableRelativeItem
                            v-for="offer in preparedOffers.sale.active"
                            :key="offer.id"
                            :offer="offer"
                        />
                        <OfferTableRelativeItem
                            v-for="offer in preparedOffers.sale.passive"
                            :key="offer.id"
                            :offer="offer"
                        />
                    </div>
                </Tab>
                <Tab
                    id="five-tab"
                    :is-disabled="!hasStorageOffers"
                    name="Ответ. хранение"
                    :suffix="storageOffersSuffix"
                >
                    <div class="offer-table-item-dropdown__list">
                        <OfferTableRelativeItem
                            v-for="offer in preparedOffers.storage.active"
                            :key="offer.id"
                            :offer="offer"
                        />
                        <OfferTableRelativeItem
                            v-for="offer in preparedOffers.storage.passive"
                            :key="offer.id"
                            :offer="offer"
                        />
                    </div>
                </Tab>
            </Tabs>
        </td>
    </tr>
</template>

<script setup>
import Tabs from '@/components/common/Tabs/Tabs.vue';
import Tab from '@/components/common/Tabs/Tab.vue';
import { computed } from 'vue';
import { dealOptions } from '@/const/options/deal.options.js';
import OfferTableRelativeItem from '@/components/Offer/OfferTableRelativeItem.vue';
import OfferTableItemObject from '@/components/Offer/TableItem/OfferTableItemObject.vue';

const props = defineProps({
    offer: {
        type: Object,
        required: true
    },
    miniOffers: {
        type: Array,
        default: () => []
    }
});

const preparedOffers = computed(() => {
    const _offers = {
        rent: {
            active: [],
            passive: []
        },
        sale: {
            active: [],
            passive: []
        },
        storage: {
            active: [],
            passive: []
        },
        sublease: {
            active: [],
            passive: []
        }
    };

    props.miniOffers.forEach(offer => {
        offer.object = { photo: props.offer.object.photo };

        if (offer.deal_type === dealOptions.typeStatement.RENT) {
            if (offer.status === 1) _offers.rent.active.push(offer);
            else _offers.rent.passive.push(offer);
        } else if (offer.deal_type === dealOptions.typeStatement.SALE) {
            if (offer.status === 1) _offers.sale.active.push(offer);
            else _offers.sale.passive.push(offer);
        } else if (offer.deal_type === dealOptions.typeStatement.STORAGE) {
            if (offer.status === 1) _offers.storage.active.push(offer);
            else _offers.storage.passive.push(offer);
        } else if (offer.deal_type === dealOptions.typeStatement.SUBLEASE) {
            if (offer.status === 1) _offers.sublease.active.push(offer);
            else _offers.sublease.passive.push(offer);
        }
    });

    return _offers;
});

const hasRentOffers = computed(
    () => preparedOffers.value.rent.active.length || preparedOffers.value.rent.passive.length
);
const hasSaleOffers = computed(
    () => preparedOffers.value.sale.active.length || preparedOffers.value.sale.passive.length
);
const hasStorageOffers = computed(
    () => preparedOffers.value.storage.active.length || preparedOffers.value.storage.passive.length
);
const hasSubleaseOffers = computed(
    () =>
        preparedOffers.value.sublease.active.length || preparedOffers.value.sublease.passive.length
);

const createSuffix = count =>
    `<span class='offer-table-item-dropdown__suffix dashboard-chip dashboard-bg-danger-l'>(${count})</span>`;

const rentOffersSuffix = computed(() => {
    if (hasRentOffers.value) {
        return createSuffix(
            `${preparedOffers.value.rent.active.length}/${preparedOffers.value.rent.passive.length}`
        );
    }
    return undefined;
});

const saleOffersSuffix = computed(() => {
    if (hasSaleOffers.value) {
        return createSuffix(
            `${preparedOffers.value.sale.active.length}/${preparedOffers.value.sale.passive.length}`
        );
    }
    return undefined;
});

const storageOffersSuffix = computed(() => {
    if (hasStorageOffers.value) {
        return createSuffix(
            `${preparedOffers.value.storage.active.length}/${preparedOffers.value.storage.passive.length}`
        );
    }
    return undefined;
});

const subleaseOffersSuffix = computed(() => {
    if (hasSubleaseOffers.value) {
        return createSuffix(
            `${preparedOffers.value.sublease.active.length}/${preparedOffers.value.sublease.passive.length}`
        );
    }
    return undefined;
});

const areaBuilding = computed(() => {
    if (props.offer.object.is_land)
        return props.offer.object.area_field_full.toLocaleString('ru-RU');
    return props.offer.area_building.toLocaleString('ru-RU');
});

const objectType = computed(() => {
    if (props.offer.object.is_land) return 'участка';
    return 'строения';
});
</script>
