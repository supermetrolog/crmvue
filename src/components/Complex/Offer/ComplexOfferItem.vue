<template>
    <div class="trade-offer-item">
        <div class="trade-offer-item__header">
            <div
                class="trade-offer-item__label"
                :class="{ 'trade-offer-item__label--archived': isArchived }"
            >
                <span v-tippy="`ID сделки`">
                    ID {{ tradeOffer.object_id }}-{{ dealTypeShort }}
                </span>
                /
                <span v-tippy="`ID торгового предложения`"> {{ tradeOffer.id }} </span>
            </div>
            <ComplexOfferStatus
                v-if="isFinished"
                class="trade-offer-item__status"
                :status="status"
            />
            <ComplexActions class="trade-offer-item__actions" :buttons="actionButtons" />
            <span class="trade-offer-item__date">Обновлено {{ formattedLastUpdate }} </span>
        </div>
        <div class="trade-offer-item__tables">
            <ComplexOfferArea
                :title="areaTableTitle"
                :area="area"
                :pallets="pallets"
                :deal-type="dealType"
                class="trade-offer-item__table"
            />
            <ComplexOfferPrice
                @set-price-option="setPriceOption"
                :title="priceTableTitle"
                :price="price"
                :subtitle="priceTableSubtitle"
                :unit-type="priceTableUnitType"
                :price-option="priceOption"
                class="trade-offer-item__table"
            />
        </div>
        <div class="trade-offer-item__content">
            <ComplexPurposes
                v-if="tradeOffer.purposes_block.length"
                :purposes="tradeOffer.purposes_block"
            />
            <ComplexParameters :parameters="parameters" />
            <ComplexOfferAdvertisements :advertisements="advertisements" />
        </div>
        <ComplexTabs class="trade-offer-item__tabs" :offer="tradeOffer" />
        <div class="trade-offer-item__footer">
            <span class="trade-offer-item__date">Создано {{ formattedPublishDate }}</span>
        </div>
    </div>
</template>

<script>
import { unitTypes } from '@/const/unitTypes';
import ComplexOfferArea from '@/components/Complex/Offer/ComplexOfferArea.vue';
import { alg } from '@/utils/alg';
import ComplexOfferPrice from '@/components/Complex/Offer/ComplexOfferPrice.vue';
import { reducer } from '@/utils/reducer.js';
import ComplexOfferStatus from '@/components/Complex/Offer/ComplexOfferStatus.vue';
import ComplexTabs from '@/components/Complex/ComplexTabs.vue';
import ComplexActions from '@/components/Complex/ComplexActions.vue';
import ComplexOfferAdvertisements from '@/components/Complex/Offer/ComplexOfferAdvertisements.vue';
import { PriceOptionList, PriceOptionTypes } from '@/const/const';
import ComplexParameters from '@/components/Complex/ComplexParameters.vue';
import { entityProperties } from '@/const/properties/properties';
import { mapper } from '@/utils/mapper';
import ComplexPurposes from '@/components/Complex/ComplexPurposes.vue';
import { mapGetters } from 'vuex';
import { deleteObjectsWithEmptyProperties } from '@/utils/deleteObjectsWithEmptyProperties.js';

export default {
    name: 'ComplexOfferItem',
    components: {
        ComplexPurposes,
        ComplexParameters,
        ComplexOfferAdvertisements,
        ComplexActions,
        ComplexOfferStatus,
        ComplexOfferPrice,
        ComplexOfferArea,
        ComplexTabs
    },
    inject: ['dealTypeShort', 'dealType'],
    props: {
        tradeOffer: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            unitTypes,
            priceOption: {
                id: PriceOptionTypes.RUB_PER_SQUARE_METERS_PER_YEAR,
                ...PriceOptionList[PriceOptionTypes.RUB_PER_SQUARE_METERS_PER_YEAR]
            }
        };
    },
    computed: {
        ...mapGetters(['THIS_USER']),
        priceProperties: () => entityProperties.offer.priceWithSections,
        parts() {
            return this.$store.getters['Complex/getPartsByIds'](this.tradeOffer.parts);
        },
        actionButtons() {
            return {
                edit: {},
                advert: { value: this.hasAdvertisements },
                dislike: { value: false },
                favorite: { value: false },
                notifications: { value: false },
                pdf: {
                    handler: () => {
                        const urlLink = this.$url.pdf(
                            {
                                type_id: 1,
                                offer_id: this.tradeOffer.id,
                                object_id: this.tradeOffer.object_id
                            },
                            this.THIS_USER.id
                        );
                        window.open(urlLink, '_blank');
                    }
                },
                deal: { value: false },
                delete: { value: this.isArchived, label: 'Архивировать', disabled: this.isArchived }
            };
        },
        areaTableTitle() {
            return this.$formatter.numberOrRangeNew(
                this.tradeOffer.area_min,
                this.tradeOffer.area_max
            );
        },
        priceTableTitle() {
            const priceTableTitleObject = {
                valueMax: 0,
                valueMin: 0,
                unitType: this.priceOption.unitType
            };

            switch (this.dealType.id) {
                case 2: {
                    // Продажа
                    if (this.tradeOffer.price_sale_min) {
                        priceTableTitleObject.valueMin =
                            this.tradeOffer.price_sale_min * this.tradeOffer.area_min;
                        priceTableTitleObject.valueMax =
                            this.tradeOffer.price_sale_max * this.tradeOffer.area_max;
                    } else {
                        priceTableTitleObject.valueMin =
                            this.tradeOffer.price_field_min * this.tradeOffer.area_min;
                        priceTableTitleObject.valueMax =
                            this.tradeOffer.price_field_max * this.tradeOffer.area_max;
                    }

                    priceTableTitleObject.unitType = unitTypes.RUB;
                    break;
                }
                case 3: {
                    // Ответ-хранение
                    priceTableTitleObject.valueMin = reducer.strictMin(
                        this.price.range,
                        'valueMin'
                    );
                    priceTableTitleObject.valueMax = reducer.max(this.price.range, 'valueMax');

                    priceTableTitleObject.unitType = unitTypes.RUB_PER_PALLET_PLACE_PER_DAY;
                    break;
                }
                default: {
                    const rangeValueMin = reducer.min(
                        [...this.price.warehouse, ...this.price.range],
                        'valueMin'
                    );

                    const rangeValueMax = reducer.max(
                        [...this.price.warehouse, ...this.price.range],
                        'valueMax'
                    );

                    priceTableTitleObject.valueMin = alg.strictMin(
                        rangeValueMin,
                        reducer.min(this.price.service, 'value')
                    );

                    priceTableTitleObject.valueMax = Math.max(
                        rangeValueMax,
                        reducer.max(this.price.service, 'value')
                    );
                    break;
                }
            }

            return priceTableTitleObject;
        },
        priceTableUnitType() {
            if (this.dealType.id === 2) {
                return unitTypes.RUB_PER_SQUARE_METERS;
            } else if (this.dealType.id === 3) {
                return unitTypes.RUB_PER_PALLET_PLACE_PER_DAY;
            }

            return this.priceOption.unitType;
        },
        priceTableSubtitle() {
            if (!this.price.warehouse.length) {
                return null;
            }

            return {
                label: 'E - складская',
                valueMin: reducer.min(this.price.warehouse, 'valueMin'),
                valueMax: reducer.max(this.price.warehouse, 'valueMax')
            };
        },
        formattedLastUpdate() {
            return this.$formatter.date(this.tradeOffer.last_update, true);
        },
        formattedPublishDate() {
            return this.$formatter.date(this.tradeOffer.publ_time, true);
        },
        status() {
            const statusObject = {
                type: this.tradeOffer.deal_id ? 2 : this.tradeOffer.deleted ? 3 : 1
            };

            if (this.tradeOffer.deal_id) {
                statusObject.finish_date = Date.now().toString();
                statusObject.company = '[Название компании]';
                statusObject.realtor = '[Название риелторской компании]';
                statusObject.consultant = '[Брокер]';
                statusObject.dealId = this.tradeOffer.deal_id;
            }

            return statusObject;
        },
        area() {
            const areaProperties = Object.keys(this.tradeOffer.preparedArea).reduce((acc, key) => {
                const current = this.tradeOffer.preparedArea[key];

                if (current.valueMax === 0 || current.valueMin === Infinity) return acc;

                return {
                    ...acc,
                    [key]: {
                        ...current,
                        description: deleteObjectsWithEmptyProperties(
                            current.description,
                            'valueMax',
                            0
                        )
                    }
                };
            }, {});

            areaProperties.floor = {
                ...areaProperties.floor,
                valueMin: this.tradeOffer.area_warehouse_min || this.tradeOffer.area_floor_min,
                valueMax: this.tradeOffer.area_warehouse_max || this.tradeOffer.area_floor_max
            };

            return areaProperties;
        },
        price() {
            const rangePrices = Object.keys(this.priceProperties.range).map(property => ({
                label: this.priceProperties.range[property],
                valueMin: this.tradeOffer[`${property}_min`],
                valueMax: this.tradeOffer[`${property}_max`]
            }));

            const servicePrices = Object.keys(this.priceProperties.service).map(property => ({
                label: this.priceProperties.service[property],
                value: this.tradeOffer[property]
            }));

            const serviceInPrices = Object.keys(this.priceProperties.service_in).map(property => ({
                label: this.priceProperties.service_in[property],
                value: this.tradeOffer[property]
            }));

            const serviceOutPrices = Object.keys(this.priceProperties.service_out).map(
                property => ({
                    label: this.priceProperties.service_out[property],
                    value: this.tradeOffer[property]
                })
            );

            const warehousePrices = Object.keys(this.priceProperties.warehouse).map(property => ({
                label: this.priceProperties.warehouse[property],
                valueMin: this.tradeOffer[`${property}_min`],
                valueMax: this.tradeOffer[`${property}_max`]
            }));

            return {
                range: deleteObjectsWithEmptyProperties(rangePrices, 'valueMax', 0),
                service: deleteObjectsWithEmptyProperties(servicePrices, 'value', 0),
                warehouse: deleteObjectsWithEmptyProperties(warehousePrices, 'valueMax', 0),
                serviceIn: deleteObjectsWithEmptyProperties(serviceInPrices, 'value', 0),
                serviceOut: deleteObjectsWithEmptyProperties(serviceOutPrices, 'value', 0)
            };
        },
        parameters() {
            return mapper.propertiesToParametersFormat(
                this.tradeOffer,
                entityProperties.offer.parameters
            );
        },
        advertisements() {
            return Object.keys(entityProperties.offer.advertisements).map(key => {
                const properties = Object.keys(
                    entityProperties.offer.advertisements[key].properties
                ).map(property => ({
                    label: entityProperties.offer.advertisements[key].properties[property].label,
                    value: this.tradeOffer[property]
                }));

                return {
                    label: entityProperties.offer.advertisements[key].label,
                    active: properties.some(element => element.value),
                    properties: properties
                };
            });
        },
        hasAdvertisements() {
            return this.advertisements.some(element => element.active);
        },
        isArchived() {
            return this.tradeOffer.deal_id || this.tradeOffer.deleted;
        },
        isFinished() {
            return !!this.tradeOffer.deal_id;
        },
        pallets() {
            return this.$formatter.numberOrRangeNew(
                this.tradeOffer.pallet_place_min,
                this.tradeOffer.pallet_place_max
            );
        }
    },
    methods: {
        setPriceOption(id) {
            if (this.priceOption.id !== id) {
                this.priceOption = {
                    id: id,
                    ...PriceOptionList[id]
                };
            }
        }
    }
};
</script>
