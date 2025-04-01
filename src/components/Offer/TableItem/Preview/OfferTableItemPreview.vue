<template>
    <div class="offer-table-item-preview">
        <a
            v-if="withOldUrl"
            :href="offerOldUrl"
            target="_blank"
            class="button button--small offer-table-item__button"
        >
            Старая версия
        </a>
        <div class="offer-table-item-preview__header mb-1">
            <UiField v-if="isPassive" class="dashboard-bg-danger-l">Пассив</UiField>
            <UiField v-else class="dashboard-bg-success-l">
                {{ dealType }}
            </UiField>
            <UiField
                v-if="offer.hide_from_market"
                tooltip="Не выгружается"
                class="dashboard-bg-warning-l"
            >
                <i class="fa-solid fa-eye-slash"></i>
            </UiField>
            <UiField tooltip="Класс объекта" class="dashboard-bg-danger-l">
                {{ offer.class_name }}
            </UiField>
            <UiField v-if="offer.object" tooltip="Общая площадь объекта" color="light">
                <i class="fa-solid fa-expand"></i>
                <WithUnitType :unit-type="unitTypes.SQUARE_METERS">
                    {{ fullArea }}
                </WithUnitType>
            </UiField>
        </div>
        <component
            :is="as"
            @click.stop="$emit('click-preview')"
            class="offer-table-item-preview__container"
            :href="offerUrl"
            target="_blank"
        >
            <LazyImage v-if="offer.preview" :src="offer.preview" />
            <NoImage v-else-if="!offer.thumb" />
            <OfferTableItemPreviewMotionSlider
                v-else
                :thumb="offer.thumb"
                :photos="offer.object?.photo ?? offer.photos ?? [offer.image]"
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
        </component>
        <div class="offer-table-item-preview__types">
            <template v-if="offer.object_type?.length">
                <UiField
                    v-for="element in objectTypes"
                    :key="element.id"
                    :tooltip="element.name"
                    color="light"
                >
                    <i :class="element.icon" />
                </UiField>
            </template>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { objectOptions } from '@/const/options/object.options.js';
import OfferTableItemPreviewMotionSlider from '@/components/Offer/TableItem/OfferTableItemPreviewMotionSlider.vue';
import { dealOptions } from '@/const/options/deal.options.js';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { toNumberFormat } from '@/utils/formatters/number.js';
import { getLinkOfferByObject, getLinkOfferOldByObject } from '@/utils/url.js';
import NoImage from '@/components/common/NoImage.vue';
import LazyImage from '@/components/common/LazyImage.vue';
import UiField from '@/components/common/UI/UiField.vue';

defineEmits(['click-preview']);
const props = defineProps({
    offer: {
        type: Object,
        required: true
    },
    isPassive: {
        type: Boolean,
        default: false
    },
    as: {
        type: String,
        default: 'a'
    },
    withOldUrl: {
        type: Boolean,
        default: true
    }
});

const objectTypes = computed(() => {
    return props.offer.object_type.map((element, index) => ({
        id: index,
        name: objectOptions.typeGeneral[element - 1].name,
        icon: objectOptions.typeGeneral[element - 1].icon
    }));
});

const dealType = computed(() => dealOptions.type[props.offer.deal_type]);
const fullArea = computed(() => {
    if (props.offer.object.is_land) return toNumberFormat(props.offer.object.area_field_full);
    return toNumberFormat(props.offer.object.area_building);
});
const offerUrl = computed(() => getLinkOfferByObject(props.offer));
const offerOldUrl = computed(() => getLinkOfferOldByObject(props.offer));
</script>
