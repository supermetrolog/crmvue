<template>
    <div class="offer-table-item-preview-area">
        <OfferTableItemPreviewAreaDescriptionRow label="строение" :area="object.area_building" />
        <OfferTableItemPreviewAreaDescriptionRow label="участок" :area="object.area_field_full" />
        <OfferTableItemPreviewAreaDescriptionRow label="пола" :area="object.area_floor_full" />
        <OfferTableItemPreviewAreaDescriptionRow
            label="мезонин"
            :area="object.area_mezzanine_full"
        />
        <OfferTableItemPreviewAreaDescriptionRow label="офисы" :area="object.area_office_full" />
        <OfferTableItemPreviewAreaDescriptionRow
            label="техническая"
            :area="object.area_tech_full"
        />
        <OfferTableItemPreviewAreaDescriptionRow
            label="территория вокруг"
            :area="object.area_outside"
        />
    </div>
</template>

<script setup>
import OfferTableItemPreviewAreaDescriptionRow from '@/components/Offer/TableItem/Preview/OfferTableItemPreviewAreaDescriptionRow.vue';

defineProps({
    object: {
        type: Object,
        required: true
    }
});
</script>
