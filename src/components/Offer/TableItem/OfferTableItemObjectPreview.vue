<template>
    <div class="offer-table-item-preview">
        <a
            :href="$url.complexOld(object.complex_id)"
            target="_blank"
            class="button button--small offer-table-item__button"
        >
            Старая версия
        </a>
        <div class="offer-table-item-preview__header mb-1">
            <DashboardChip class="dashboard-bg-gray-l">
                {{ object.is_land ? 'Уассток' : 'Объект' }}
            </DashboardChip>
            <DashboardChip v-tippy="'Класс объекта'" class="dashboard-bg-danger-l">
                {{ className }}
            </DashboardChip>
        </div>
        <a
            class="offer-table-item-preview__container"
            :href="$url.complex(object.complex_id)"
            target="_blank"
        >
            <VLazyImage v-if="!object.thumb" :src="$url.api.fileNotFound()" alt="image" />
            <OfferTableItemPreviewMotionSlider
                v-else
                :thumb="object.thumb"
                :photos="object.photo"
            />
            <div class="offer-table-item-preview__publishes">
                <span v-if="object.test_only" class="offer-table-item-preview__chip">
                    Тестовый лот
                </span>
            </div>
        </a>
    </div>
</template>

<script setup>
import VLazyImage from 'v-lazy-image';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { computed } from 'vue';
import { objectOptions } from '@/const/options/object.options.js';
import OfferTableItemPreviewMotionSlider from '@/components/Offer/TableItem/OfferTableItemPreviewMotionSlider.vue';

const props = defineProps({
    object: {
        type: Object,
        required: true
    },
    isPassive: {
        type: Boolean,
        default: false
    }
});

const className = computed(() => objectOptions.class[props.object.object_class]);
</script>
