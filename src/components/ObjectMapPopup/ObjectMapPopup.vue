<template>
    <div class="object-map-popup">
        <ObjectMapPopupHeader :object class="mb-1" />
        <OfferTableItemPreviewMotionSlider
            class="object-map-popup__slider"
            :thumb="object.thumb"
            :photos="object.photo ?? []"
        />
        <p class="mt-1">{{ object.address }}</p>
        <hr class="op-5" />
        <ObjectMapPopupOffers
            v-if="object.miniOffers?.length"
            :offers="object.miniOffers"
            class="mt-2"
        />
        <p v-else class="fs-2">Нет активных предложений</p>
        <hr class="op-5 mt-2" />
        <ObjectMapPopupFooter :object />
        <UiButtonIcon
            @click="$emit('close')"
            icon="fa-solid fa-close"
            small
            color="light"
            class="object-map-popup__close"
        />
    </div>
</template>
<script setup lang="ts">
import ObjectMapPopupHeader from '@/components/ObjectMapPopup/ObjectMapPopupHeader.vue';
import OfferTableItemPreviewMotionSlider from '@/components/Offer/TableItem/OfferTableItemPreviewMotionSlider.vue';
import ObjectMapPopupOffers from '@/components/ObjectMapPopup/ObjectMapPopupOffers.vue';
import ObjectMapPopupFooter from '@/components/ObjectMapPopup/ObjectMapPopupFooter.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';

export type ObjectMapMarker = {
    id: number;
    address: string;
    area_building: number;
    complex_id: number;
    latitude: number;
    longitude: number;
    object_id: number;
    original_id: number;
    status: number;
    visual_id: string;
    class: number | null;
    is_land: number;
    test_only: number | null;
    object_type: number | null;
};

defineEmits<{
    (e: 'close'): void;
}>();

defineProps<{
    marker: ObjectMapMarker;
    object: object;
}>();
</script>
<style lang="scss">
.object-map-popup {
    &__slider {
        height: 150px;
    }

    &__close {
        position: absolute;
        top: 4px;
        right: 4px;
    }
}
</style>
