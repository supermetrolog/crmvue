<template>
    <tr class="offer-table-item-dropdown">
        <td colspan="12" class="offer-table-item-dropdown__wrapper">
            <Tabs
                :options="{ useUrlFragment: false, defaultTabHash: 'second-tab' }"
                :cache-lifetime="0"
            >
                <Tab
                    id="first-tab"
                    nav-item-class="offer-table-item-dropdown__center"
                    :name="`<p>S - объекта</p><p>${areaBuilding} <small>м<sup>2</sup></small></p>`"
                    is-disabled
                ></Tab>
                <Tab
                    id="second-tab"
                    name="ТП АРЕНДА АКТИВ"
                    :suffix="
                        activeRentOffers.length
                            ? `<span class='offer-table-item-dropdown__suffix'>${activeRentOffers.length}</span>`
                            : undefined
                    "
                >
                    <OfferMiniList
                        @toggleAvito="handleToggleAvito"
                        :mini-offers="activeRentOffers"
                    />
                </Tab>
                <Tab
                    v-if="archiveRentOffers.length"
                    id="third-tab"
                    name="ТП АРЕНДА АРХИВ"
                    :suffix="
                        archiveRentOffers.length
                            ? `<span class='offer-table-item-dropdown__suffix'>${archiveRentOffers.length}</span>`
                            : undefined
                    "
                >
                    <OfferMiniList
                        @toggleAvito="handleToggleAvito"
                        :mini-offers="archiveRentOffers"
                    />
                </Tab>
                <Tab
                    v-if="salesOffers.array.length"
                    id="fourth-tab"
                    nav-item-class="offer-table-item-dropdown__sale"
                    name="Объект продается"
                    :suffix="
                        salesOffers.countOfActive
                            ? `<span class='offer-table-item-dropdown__suffix'>${salesOffers.countOfActive}</span>`
                            : undefined
                    "
                >
                    <OfferMiniList
                        @toggleAvito="handleToggleAvito"
                        :mini-offers="salesOffers.array"
                    />
                </Tab>
                <Tab
                    v-if="storageOffers.array.length"
                    id="fifth-tab"
                    name="Есть услуги О/Х"
                    nav-item-class="offer-table-item-dropdown__sale"
                    :suffix="
                        salesOffers.countOfActive
                            ? `<span class='offer-table-item-dropdown__suffix'>${salesOffers.countOfActive}</span>`
                            : undefined
                    "
                >
                    <OfferMiniList
                        @toggleAvito="handleToggleAvito"
                        :mini-offers="storageOffers.array"
                    />
                </Tab>
            </Tabs>
        </td>
    </tr>
</template>

<script>
import OfferMiniList from '@/components/Offer/OfferMiniList.vue';
import Tabs from '@/components/common/Tabs/Tabs.vue';

export default {
    name: 'OfferTableItemDropdown',
    components: {
        Tabs,
        OfferMiniList
    },
    emits: ['toggle-avito'],
    props: {
        offer: {
            type: Object,
            required: true
        },
        miniOffers: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        rentOffers() {
            return this.miniOffers.filter(offer => offer.deal_type === 1 || offer.deal_type === 4);
        },
        activeRentOffers() {
            return this.rentOffers.filter(offer => offer.status === 1);
        },
        archiveRentOffers() {
            return this.rentOffers.filter(offer => offer.status === 2);
        },
        salesOffers() {
            let sales = this.miniOffers.filter(offer => offer.deal_type === 2);
            let activeSales = sales.filter(offer => offer.status === 1);
            let archiveSales = sales.filter(offer => offer.status === 2);
            sales = [...activeSales, ...archiveSales];
            return { array: sales, countOfActive: activeSales.length };
        },
        storageOffers() {
            let storage = this.miniOffers.filter(offer => offer.deal_type === 3);
            let activeStorage = storage.filter(offer => offer.status === 1);
            let archiveStorage = storage.filter(offer => offer.status === 2);
            storage = [...activeStorage, ...archiveStorage];
            return { array: storage, countOfActive: activeStorage.length };
        },
        areaBuilding() {
            return this.offer.area_building.toLocaleString('ru-RU');
        }
    },
    methods: {
        handleToggleAvito() {
            this.$emit('toggle-avito');
        }
    }
};
</script>
