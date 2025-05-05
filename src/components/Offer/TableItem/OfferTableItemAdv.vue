<template>
    <div class="offer-table-item__advertisements">
        <UiField v-if="offer.ad_realtor" class="dashboard-bg-light"> Raysarma.ru </UiField>
        <UiField v-if="offer.ad_cian" class="dashboard-bg-light">Циан</UiField>
        <UiField v-if="offer.ad_yandex" class="dashboard-bg-light"> Яндекс</UiField>
        <UiField v-if="offer.ad_avito" class="dashboard-bg-light"> Авито</UiField>
        <UiField v-if="offer.ad_free" class="dashboard-bg-light"> Бесплатные</UiField>
    </div>
</template>
<script setup>
import UiField from '@/components/common/UI/UiField.vue';

defineProps({
    offer: {
        type: Object,
        required: true
    }
});
</script>
