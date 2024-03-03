<template>
    <div class="building-info">
        <div v-if="hasActiveOffers" class="building-info__content">
            <div class="building-info__tables">
                <ComplexDealArea
                    class="building-info__table"
                    :deal="deal.summaryBlock"
                    :original="deal"
                />
                <ComplexDealPrice class="building-info__table" :deal="deal.summaryBlock" />
            </div>
            <ComplexPurposes
                v-if="deal.summaryBlock.purposes_block.length"
                :purposes="deal.summaryBlock.purposes_block"
            />
            <ComplexParameters v-if="parameters.length" :parameters="parameters" />
        </div>
        <EmptyData v-else class="building-info__empty">
            Данные о сделке отсутсвуют в связи с отсутствием торговых предложений.
        </EmptyData>
        <div class="building-info__line">
            <ComplexDealTabs
                :has-active-offers="hasActiveOffers"
                :deal="dealPrepared"
                class="building-info__tabs"
            />
            <ComplexActions class="building-info__buttons" simple :buttons="actionButtons" />
        </div>
    </div>
</template>

<script>
import { unitTypes } from '@/const/unitTypes';
import ComplexParameters from '@/components/Complex/ComplexParameters.vue';
import ComplexActions from '@/components/Complex/ComplexActions.vue';
import ComplexDealTabs from '@/components/Complex/Deal/ComplexDealTabs.vue';
import { entityProperties } from '@/const/properties/properties';
import { mapper } from '@/utils/mapper';
import ComplexDealArea from '@/components/Complex/Deal/ComplexDealArea.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import { mapGetters } from 'vuex';
import ComplexDealPrice from '@/components/Complex/Deal/Price/ComplexDealPrice.vue';
import ComplexPurposes from '@/components/Complex/ComplexPurposes.vue';

export default {
    name: 'ComplexDealBuilding',
    components: {
        ComplexPurposes,
        ComplexDealPrice,
        EmptyData,
        ComplexDealArea,
        ComplexDealTabs,
        ComplexActions,
        ComplexParameters
    },
    inject: ['dealFloors', 'openDownloader'],
    props: {
        deal: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            unitTypes
        };
    },
    computed: {
        ...mapGetters(['THIS_USER']),
        photos() {
            if (!this.deal.summaryBlock) return [];

            const photos =
                this.deal.summaryBlock.photos instanceof Array
                    ? this.deal.summaryBlock.photos
                    : Object.values(this.deal.summaryBlock.photos);

            return photos.map(el => ({
                src: this.$url.api.objects() + el
            }));
        },
        dealPrepared() {
            return {
                ...this.deal,
                floors: this.floors
            };
        },
        partsObject() {
            return this.deal.blocks.reduce((acc, block) => {
                block.parts.forEach(part => (acc[part] = true));

                return acc;
            }, {});
        },
        floors() {
            return [...this.dealFloors].map(floor => ({
                ...floor,
                parts: floor.parts.filter(part => this.partsObject[part.id])
            }));
        },
        actionButtons() {
            return {
                dislike: {},
                favorite: {},
                notifications: {},
                pdf: {
                    disabled: !this.hasActiveOffers,
                    handler: () => {
                        const urlLink = this.$url.pdf(
                            { type_id: 2, offer_id: this.deal.id, object_id: this.deal.object_id },
                            this.THIS_USER.id
                        );
                        window.open(urlLink, '_blank');
                    }
                },
                delete: {},
                copy: {
                    handler: async () => {
                        const url = this.$url.offer(this.$route.params.complex_id, this.deal.id);

                        await navigator.clipboard.writeText(url);

                        this.$toast('Ссылка на сделку скопирована');
                    }
                },
                photos: {
                    disabled: !this.photos.length || !this.hasActiveOffers,
                    handler: () => this.openDownloader(this.photos)
                }
            };
        },
        parameters() {
            return mapper.propertiesToParametersFormat(
                this.deal.summaryBlock,
                entityProperties.deal.parameters
            );
        },
        hasActiveOffers() {
            return this.deal.blocks.some(offer => !offer.deleted && !offer.deal_id);
        }
    }
};
</script>
