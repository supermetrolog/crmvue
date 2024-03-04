<template>
    <Tr
        class="offer-table-item"
        :class="{
            passive: offer.status != 1,
            'offer-table-item--odd': odd,
            'offer-table-item--even': !odd
        }"
    >
        <Td class="offer-table-item__id" :class="{ passive: offer.status !== 1 }">
            <p>
                {{ offer.visual_id }}
            </p>
            <div v-if="offer.type_id !== 3" class="offer-table-item__actions">
                <i
                    @click="clickFavoriteOffer(offer)"
                    class="fas fa-star"
                    :class="{
                        selected: FAVORITES_OFFERS.find(
                            item => item.original_id == offer.original_id
                        )
                    }"
                ></i>
                <i @click="clickViewPdf(offer)" class="fas fa-file-pdf"></i>
                <div @click="clickOpenMore" class="actions-more">
                    <i v-if="!dropdownIsOpen" class="fa fa-chevron-down"></i>
                    <i v-else class="fa fa-chevron-up"></i>
                </div>
            </div>
        </Td>
        <Td>
            <a :href="$url.offerOldByObject(offer)" class="photo-button button">Старая версия</a>
            <div class="photo">
                <a :href="$url.offerByObject(offer)" target="_blank">
                    <div class="image-container">
                        <img :src="offer.thumb" alt="image" />
                        <span class="deal_type" :class="{ passive: offer.status != 1 }">
                            {{ offer.deal_type_name }}
                        </span>
                        <span class="object_class">
                            {{ offer.class_name }}
                        </span>
                        <span
                            v-if="offer.hide_from_market"
                            class="hide_from_market"
                            title="Не выгружается"
                        >
                            <i class="fas fa-eye-slash"></i>
                        </span>
                        <span v-if="offer.test_only" class="test_only"> Тестовый лот </span>
                    </div>
                </a>
            </div>
        </Td>
        <Td class="region">
            <p v-if="offer.region_name" class="region_item">
                {{ offer.region_name }}
            </p>
            <p v-if="offer.district_name">
                {{ offer.district_name }}
            </p>
            <p v-if="offer.district_moscow_name">
                {{ offer.district_moscow_name }}
            </p>
            <p v-if="offer.direction_name">
                {{ offer.direction_name }}
            </p>
            <p v-if="offer.town_name">
                {{ offer.town_name }}
            </p>
            <p v-if="offer.highway_name">{{ offer.highway_name }} <small>шоссе</small></p>
            <p v-if="offer.highway_moscow_name">
                {{ offer.highway_moscow_name }} <small>шоссе</small>
            </p>
            <hr />
            <p v-if="offer.address">
                {{ offer.address }}
            </p>
        </Td>
        <Td class="from_mkad" sort="from_mkad">
            <!-- {{ offer.gates }} -->
            <p v-if="offer.from_mkad">{{ offer.from_mkad }} <small>км</small></p>
            <p v-else>—</p>
        </Td>
        <Td class="area" sort="area">
            <p>
                {{ offer.calc_area_general }}
                <small>м<sup>2</sup></small>
            </p>
        </Td>
        <Td class="price" sort="price">
            <p v-if="offer.deal_type == 1 || offer.deal_type == 4">
                {{ offer.calc_price_warehouse }}
                <small>руб за м<sup>2</sup>/г</small>
            </p>
            <p v-if="offer.deal_type == 2">
                {{ offer.calc_price_sale }} <small>руб за м<sup>2</sup></small>
            </p>
            <p v-if="offer.deal_type == 3">
                {{ offer.calc_price_safe_pallet }} <small>руб за 1 п. м.</small>
            </p>
            <span v-if="offer.offer && offer.offer.tax_form">
                {{ taxForm }}
            </span>
        </Td>
        <Td class="company_about">
            <template v-if="offer.company !== null">
                <a :href="$url.offerByObject(offer)" target="_blank">
                    {{ offer.company.full_name }}
                </a>
                <div v-if="contact" class="contact">
                    {{ contact.full_name }}
                    <a
                        v-for="email of contact.emails"
                        :key="email.email"
                        :href="'mailto:' + email.email"
                        class="d-block"
                    >
                        {{ email.email }}
                    </a>
                    <PhoneNumber
                        v-for="phone of contact.phones"
                        :key="phone.id"
                        :phone="phone"
                        :contact="contact"
                    />
                </div>
            </template>
        </Td>
        <Td class="consultant">
            <p v-if="offer.consultant">
                {{ offer.consultant.userProfile.full_name }}
            </p>
        </Td>
        <Td class="add">
            <p v-if="offer.ad_realtor">Realtor.ru</p>
            <p v-if="offer.ad_cian">Циан</p>
            <p v-if="offer.ad_yandex">Яндекс</p>
            <p v-if="offer.ad_free">Бесплатные</p>
        </Td>
        <Td class="date" sort="last_update">
            {{ offer.last_update_format }}
        </Td>
        <Td class="status" sort="status">
            <h4 v-if="offer.status == 1" class="text-success">Актив</h4>
            <span v-else class="badge badge-warning autosize"> Пассив </span>
        </Td>
    </Tr>
    <tr v-if="miniOffersLoader">
        <Loader v-if="miniOffersLoader" class="small center" />
    </tr>
    <DropDown>
        <OfferTableDropdown
            v-if="dropdownIsOpen && !miniOffersLoader"
            @toggleAvito="handleAvitoToggle"
            :offer="offer"
            :mini-offers="miniOffers"
        />
    </DropDown>
</template>

<script>
import DropDown from '@/components/common/DropDown.vue';
import Td from '@/components/common/Table/Td.vue';
import Tr from '@/components/common/Table/Tr.vue';
import api from '@/api/api';
import { MixinOfferItem } from '@/components/Offer/mixins.js';
import { TaxFormList } from '@/const/const';
import Loader from '@/components/common/Loader.vue';
import OfferTableDropdown from '@/components/Offer/OfferTableDropdown.vue';

export default {
    name: 'OfferTableItem',
    components: { OfferTableDropdown, Loader, Tr, Td, DropDown },
    mixins: [MixinOfferItem],
    props: {
        offer: {
            type: Object
        },
        loader: {
            type: Boolean,
            default: false
        },
        sortable: {
            type: Boolean,
            default: true
        },
        odd: {
            type: Boolean
        }
    },
    data() {
        return {
            miniOffers: [],
            miniOffersLoader: false
        };
    },
    computed: {
        taxForm() {
            if (this.offer && this.offer.offer) {
                const taxForm = TaxFormList.find(item => item.value === this.offer.offer.tax_form);
                if (taxForm) {
                    return taxForm.label;
                }
            }

            return null;
        }
    },
    methods: {
        async clickOpenMore() {
            if (this.dropdownIsOpen) {
                return (this.dropdownIsOpen = false);
            }
            this.dropdownIsOpen = true;
            this.miniOffersLoader = true;
            await this.searchMiniOffers();
        },
        async searchMiniOffers() {
            const response = await api.offers.search({
                type_id: [1],
                status: 3, // Нужно чтобы прилетали и активные и пассивные
                object_id: this.offer.object_id
            });
            if (response) {
                this.miniOffers = response.data;
            }
            this.miniOffersLoader = false;
        },
        async handleAvitoToggle() {
            await this.searchMiniOffers();
        }
    }
};
</script>
