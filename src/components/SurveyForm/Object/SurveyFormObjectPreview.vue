<template>
    <div class="survey-form-object__preview">
        <OfferTableItemPreviewMotionSlider :thumb="object.thumb" :photos="object.photo ?? []" />
        <div class="survey-form-object__preview-header">
            <span class="messenger-dialog-offer__id">{{ object.id }}</span>
            <UiButtonIcon
                @click.stop.prevent="$emit('show-preview')"
                small
                label="Открыть просмотр фото"
                class="offer-table-item-preview__button bg-white ml-auto"
                icon="fa-solid fa-image"
            />
            <UiButtonIcon
                @click.stop.prevent="$emit('show-map')"
                small
                icon="fa-solid fa-map-location-dot"
                class="offer-table-item-preview__button bg-white"
                label="Открыть на карте"
            />
        </div>
    </div>
</template>
<script setup>
import OfferTableItemPreviewMotionSlider from '@/components/Offer/TableItem/OfferTableItemPreviewMotionSlider.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';

defineEmits(['show-preview', 'show-map']);
defineProps({
    object: {
        type: Object,
        required: true
    }
});
</script>
