<template>
    <div class="object-map-popup-group">
        <p class="object-map-popup-group__label">{{ label }}:</p>
        <div class="object-map-popup-group__grid">
            <ObjectMapPopupOffer
                v-for="offer in offers"
                :key="offer.id"
                class="object-map-popup-group__item"
                data-tour-id="object-map-popup:offer"
                :offer
            />
        </div>
    </div>
</template>
<script setup lang="ts">
import { IndustryObjectMiniOffer } from '@/components/ObjectMapPopup/types';
import ObjectMapPopupOffer from '@/components/ObjectMapPopup/ObjectMapPopupOffer.vue';

defineProps<{
    label: string;
    offers: IndustryObjectMiniOffer[];
}>();
</script>
<style lang="scss">
.object-map-popup-group {
    &__label {
        font-weight: 500;
        margin-bottom: 8px;
        font-size: 16px;
    }

    &__grid {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    &__item {
        max-width: 50%;
        flex-grow: 1;
    }
}
</style>
