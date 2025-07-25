<template>
    <div class="offer-table-item-preview">
        <a
            :href="complexOldUrl"
            target="_blank"
            class="button button--small offer-table-item__button"
        >
            Старая версия
        </a>
        <div class="offer-table-item-preview__header mb-1">
            <UiField class="dashboard-bg-gray-l">
                {{ object.is_land ? 'Участок' : 'Объект' }}
            </UiField>
            <UiField tooltip="Класс объекта" class="dashboard-bg-danger-l">
                {{ className }}
            </UiField>
        </div>
        <a class="offer-table-item-preview__container" :href="complexUrl" target="_blank">
            <VLazyImage v-if="!object.thumb" :src="notFoundUrl" alt="image" />
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
import { computed } from 'vue';
import { objectOptions } from '@/const/options/object.options.js';
import OfferTableItemPreviewMotionSlider from '@/components/Offer/TableItem/OfferTableItemPreviewMotionSlider.vue';
import UiField from '@/components/common/UI/UiField.vue';
import { getApiFileNotFound, getLinkComplex, getLinkComplexOld } from '@/utils/url.js';

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

const complexUrl = computed(() => getLinkComplex(props.object.complex_id));
const complexOldUrl = computed(() => getLinkComplexOld(props.object.complex_id));
const notFoundUrl = computed(() => getApiFileNotFound());
</script>
