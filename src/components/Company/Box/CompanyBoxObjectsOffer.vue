<template>
    <a
        :href="offerUrl"
        target="_blank"
        class="company-box-objects-offer"
        :class="{ passive: offer.status !== 1 }"
    >
        <UiTooltipIcon
            :tooltip="offer.description?.length ? offer.description : 'Описание отсутствует'"
            icon="fa-regular fa-question-circle"
            class="icon"
        />
        <UiField class="dashboard-bg-success-l">{{ offer.visual_id }}</UiField>
        <UiField class="dashboard-bg-success-l">{{ offer.deal_type_name }}</UiField>
        <UiField class="dashboard-bg-success-l">
            <WithUnitType :unit-type="unitTypes.SQUARE_METERS">
                {{ offer.calc_area_general }}
            </WithUnitType>
        </UiField>
        <UiField class="dashboard-bg-success-l">
            <WithUnitType
                v-if="offer.deal_type === 1 || offer.deal_type === 4"
                :unit-type="unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR"
            >
                {{ offer.calc_price_warehouse }}
            </WithUnitType>
            <WithUnitType
                v-else-if="offer.deal_type === 2"
                :unit-type="unitTypes.RUB_PER_SQUARE_METERS"
            >
                {{ offer.calc_price_sale }}
            </WithUnitType>
            <WithUnitType v-if="offer.deal_type === 3" :unit-type="unitTypes.RUB_PER_PALLET_PLACE">
                {{ offer.calc_price_safe_pallet }}
            </WithUnitType>
        </UiField>
        <a :href="oldOfferUrl" target="_blank" class="button button--small">Старая версия</a>
    </a>
</template>

<script>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';
import UiField from '@/components/common/UI/UiField.vue';

export default {
    name: 'CompanyBoxObjectsOffer',
    components: { UiField, UiTooltipIcon, WithUnitType },
    props: {
        offer: {
            type: Object,
            required: true
        }
    },
    computed: {
        unitTypes() {
            return unitTypes;
        },
        offerUrl() {
            return this.$url.offerByObject(this.offer);
        },
        oldOfferUrl() {
            return this.$url.offerOldByObject(this.offer);
        }
    }
};
</script>
