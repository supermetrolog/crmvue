<template>
    <div class="object-map-popup-offer">
        <UiDropdownActions class="w-100">
            <template #trigger>
                <UiButton
                    :disabled="isFake"
                    color="transparent"
                    small
                    class="w-100 object-map-popup-offer__trigger"
                >
                    <div class="object-map-popup-offer__content">
                        <WithUnitType
                            v-if="hasArea"
                            :unit-type="unitTypes.SQUARE_METERS"
                            class="object-map-popup-offer__area"
                        >
                            {{ offer.calc_area_general }}
                        </WithUnitType>
                        <WithUnitType
                            v-else
                            :unit-type="unitTypes.PALLET_PLACE"
                            class="object-map-popup-offer__area"
                        >
                            {{ offer.calc_pallet_place }}
                        </WithUnitType>
                        <WithUnitType
                            class="object-map-popup-offer__price text-grey"
                            :unit-type="priceUnitType"
                        >
                            {{ price }}
                        </WithUnitType>
                    </div>
                    <UiDropdownActionsTrigger
                        color="light"
                        class="object-map-popup-offer__button px-1"
                    />
                </UiButton>
            </template>
            <template #menu>
                <UiDropdownActionsGroup>
                    <a
                        :href="pdfLink"
                        target="_blank"
                        class="ui-dropdown-actions__element text-inherit"
                    >
                        <UiDropdownActionsButton
                            icon="fa-solid fa-file-pdf"
                            label="Открыть презентацию"
                        />
                    </a>
                    <a
                        :href="offerLink"
                        target="_blank"
                        class="ui-dropdown-actions__element text-inherit"
                    >
                        <UiDropdownActionsButton
                            icon="fa-solid fa-external-link"
                            label="Подробнее"
                        />
                    </a>
                </UiDropdownActionsGroup>
                <UiDropdownActionsGroup>
                    <UiDropdownActionsButton
                        @handle="toggleFavorite"
                        icon="fa-solid fa-star"
                        :close-on-click="false"
                        :active="isFavorite"
                        :label="isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'"
                    />
                </UiDropdownActionsGroup>
            </template>
        </UiDropdownActions>
    </div>
</template>
<script setup lang="ts">
import { IndustryObjectMiniOffer } from '@/components/ObjectMapPopup/types';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { computed } from 'vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { getLinkOffer, getLinkPDF } from '@/utils/url';
import { unitTypes } from '@/const/unitTypes';
import UiDropdownActionsGroup from '@/components/common/UI/DropdownActions/UiDropdownActionsGroup.vue';
import { useStore } from 'vuex';
import { useAuth } from '@/composables/useAuth';
import UiDropdownActionsTrigger from '@/components/common/UI/DropdownActions/UiDropdownActionsTrigger.vue';

const props = defineProps<{
    offer: IndustryObjectMiniOffer;
}>();

const isFake = computed(() => Boolean(props.offer.is_fake));

const hasArea = computed(() => props.offer.calc_area_general !== '0');

const { currentUserId } = useAuth();

const offerLink = computed(() => getLinkOffer(props.offer.complex_id, props.offer.id));

const pdfLink = computed(() => {
    return getLinkPDF(
        {
            type_id: 1,
            offer_id: props.offer.original_id,
            object_id: props.offer.object_id
        },
        currentUserId.value
    );
});

const priceUnitType = computed(() => {
    if (props.offer.deal_type === 1 || props.offer.deal_type === 4) {
        return unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR;
    }

    if (props.offer.deal_type === 2) {
        return unitTypes.RUB_PER_SQUARE_METERS;
    }

    return unitTypes.RUB_PER_PALLET_PLACE;
});

const price = computed(() => {
    if (props.offer.deal_type === 1 || props.offer.deal_type === 4) {
        return props.offer.calc_price_warehouse;
    }

    if (props.offer.deal_type === 2) {
        return props.offer.calc_price_sale;
    }

    return props.offer.calc_price_safe_pallet;
});

const store = useStore();

const isFavorite = computed(() => {
    return store.state.Offers.favoritesOffersCache[props.offer.original_id];
});

async function toggleFavorite() {
    if (!isFavorite.value) {
        return await store.dispatch('ADD_FAVORITES_OFFER', props.offer);
    }

    await store.dispatch('DELETE_FAVORITES_OFFERS', props.offer);
}
</script>
<style lang="scss">
.object-map-popup-offer {
    position: relative;

    &__content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    &__area {
        font-size: 15px;
        font-weight: 500;
        width: calc(100% - 30px);
        margin-left: -2px;
        text-align: start;
    }

    &__price {
        font-size: 14px;
    }

    &__button {
        position: absolute;
        top: 3px;
        right: 5px;
        width: 30px;
        font-size: 16px !important;
    }

    &__trigger {
        color: inherit !important;

        > span {
            width: 100%;
        }
    }
}
</style>
