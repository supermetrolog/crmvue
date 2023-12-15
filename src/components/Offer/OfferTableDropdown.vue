<template>
    <tr class="OfferTableDropdown">
        <td colspan="11" class="OfferTableDropdown-wrapper">
            <div class="OfferTableDropdown-header-actions">
                <button title="Строение">
                    <i class="fas fa-warehouse"></i>
                </button>
                <button title="Компания">
                    <i class="fas fa-industry"></i>
                </button>
            </div>
            <Tabs
                :options="{ useUrlFragment: false, defaultTabHash: 'second-tab' }"
                :cache-lifetime="0"
                wrapper-class="OfferTableDropdown-header"
                nav-class="OfferTableDropdown-menu"
                nav-item-class="OfferTableDropdown-menu-item"
                nav-item-active-class="item-active"
                nav-item-link-class="OfferTableDropdown-menu-item-link"
                nav-item-link-active-class="link-active"
                nav-item-link-disabled-class="link-disabled"
                panels-wrapper-class="OfferTableDropdown-offers"
            >
                <Tab
                    id="first-tab"
                    :name="`<span>S - объекта</span><span>${areaBuilding} <small>м<sup>2</sup></small></span>`"
                    :is-disabled="true"
                ></Tab>
                <Tab
                    id="second-tab"
                    name="ТП АРЕНДА АКТИВ"
                    :suffix="`<span class='${activeRentOffers.length ? 'suffix' : 'suffix suffix-none'}'>${
                        activeRentOffers.length
                    }</span>`"
                >
                    <OfferMiniList @toggleAvito="handleToggleAvito" :miniOffers="activeRentOffers" />
                </Tab>
                <Tab
                    v-if="archiveRentOffers.length"
                    id="third-tab"
                    name="ТП АРЕНДА АРХИВ"
                    :suffix="`<span class='suffix suffix-none'>1</span>`"
                >
                    <OfferMiniList @toggleAvito="handleToggleAvito" :miniOffers="archiveRentOffers" />
                </Tab>
                <Tab
                    v-if="salesOffers.array.length"
                    id="fourth-tab"
                    name="<span class='sales-link'>Объект продается!</span>"
                    :suffix="`<span class='${salesOffers.countOfActive ? 'suffix' : 'suffix suffix-none'}'>${
                        salesOffers.countOfActive
                    }</span>`"
                >
                    <OfferMiniList @toggleAvito="handleToggleAvito" :miniOffers="salesOffers.array" />
                </Tab>
                <Tab
                    v-if="storageOffers.array.length"
                    id="fifth-tab"
                    name="<span class='storage-link'>Есть услуги О/Х!</span>"
                    :suffix="`<span class='${storageOffers.countOfActive ? 'suffix' : 'suffix suffix-none'}'>${
                        storageOffers.countOfActive
                    }</span>`"
                >
                    <OfferMiniList @toggleAvito="handleToggleAvito" :miniOffers="storageOffers.array" />
                </Tab>
            </Tabs>
        </td>
    </tr>
</template>

<script>
import OfferMiniList from '@/components/Offer/OfferMiniList.vue';

export default {
    name: 'OfferTableDropdown',
    components: {
        OfferMiniList
    },
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
    data() {
        return {};
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
            this.$emit('toggleAvito');
        }
    }
};
</script>