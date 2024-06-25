<template>
    <div class="offer-table-item-preview">
        <a
            :href="$url.offerOldByObject(offer)"
            target="_blank"
            class="button offer-table-item__button"
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
        <DashboardChip
            v-if="offer.object_type?.length"
            class="offer-table-item-preview__object-type dashboard-bg-light mb-2"
        >
            {{ offer.object_type_name }}
        </DashboardChip>
        <a
            class="offer-table-item-preview__container"
            :href="$url.offerByObject(offer)"
            target="_blank"
        >
            <VLazyImage
                @error="hasError = true"
                :src="hasError ? $url.api.fileNotFound() : offer.thumb"
                alt="image"
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
    </div>
</template>

<script>
import VLazyImage from 'v-lazy-image';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';

export default {
    name: 'OfferTableItemPreview',
    components: {
        DashboardChip,
        VLazyImage
    },
    props: {
        offer: {
            type: Object
        },
        isPassive: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            hasError: false
        };
    }
};
</script>
