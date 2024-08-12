<template>
    <div class="offer-table-item-preview">
        <a
            :href="$url.offerOldByObject(offer)"
            target="_blank"
            class="button button--small offer-table-item__button"
        >
            Старая версия
        </a>
        <div class="offer-table-item-preview__header mb-1">
            <DashboardChip v-if="isPassive" class="dashboard-bg-danger-l">Пассив</DashboardChip>
            <DashboardChip v-else class="dashboard-bg-success-l">
                {{ offer.deal_type_name }}
            </DashboardChip>
            <DashboardChip
                v-if="offer.hide_from_market"
                v-tippy="'Не выгружается'"
                class="dashboard-bg-warning-l"
            >
                <i class="fa-solid fa-eye-slash"></i>
            </DashboardChip>
            <DashboardChip v-tippy="'Класс объекта'" class="dashboard-bg-danger-l">
                {{ offer.class_name }}
            </DashboardChip>
        </div>
        <a
            class="offer-table-item-preview__container"
            :href="$url.offerByObject(offer)"
            target="_blank"
        >
            <VLazyImage v-if="!offer.thumb" :src="$url.api.fileNotFound()" alt="image" />
            <OfferTableItemPreviewMotionSlider
                v-else
                :thumb="offer.thumb"
                :photos="offer.object?.photo ?? offer.photos ?? []"
            />
            <div class="offer-table-item-preview__parameters">
                <span
                    v-if="offer.offer?.is_exclusive"
                    class="offer-table-item-preview__chip dashboard-bg-danger"
                >
                    Эксклюзив
                </span>
                <span
                    v-if="offer.offer?.built_to_suit === 1"
                    class="offer-table-item-preview__chip dashboard-bg-primary"
                >
                    Инвестпроект
                </span>
            </div>
            <div class="offer-table-item-preview__publishes">
                <span v-if="offer.test_only" class="offer-table-item-preview__chip">
                    Тестовый лот
                </span>
                <span v-if="offer.is_fake" class="offer-table-item-preview__chip">Фейк</span>
            </div>
        </a>
        <div v-if="offer.object_type?.length" class="offer-table-item-preview__types">
            <DashboardChip
                v-for="element in objectTypes"
                :key="element.id"
                v-tippy="element.name"
                class="dashboard-bg-light"
            >
                <i :class="element.icon" />
            </DashboardChip>
        </div>
    </div>
</template>

<script setup>
import VLazyImage from 'v-lazy-image';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { computed } from 'vue';
import { objectOptions } from '@/const/options/object.options.js';
import OfferTableItemPreviewMotionSlider from '@/components/Offer/TableItem/OfferTableItemPreviewMotionSlider.vue';

const props = defineProps({
    offer: {
        type: Object,
        required: true
    },
    isPassive: {
        type: Boolean,
        default: false
    }
});

const objectTypes = computed(() => {
    return props.offer.object_type.map((element, index) => ({
        id: index,
        name: objectOptions.typeGeneral[element - 1].name,
        icon: objectOptions.typeGeneral[element - 1].icon
    }));
});
</script>
