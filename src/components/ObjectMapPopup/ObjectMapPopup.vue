<template>
    <div class="object-map-popup" data-tour-id="object-map-popup:wrapper">
        <ObjectMapPopupHeader :object class="mb-1" />
        <OfferTableItemPreviewMotionSlider
            class="object-map-popup__slider"
            data-tour-id="object-map-popup:slider"
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
        <ObjectMapPopupFooter
            @chat-opened="$emit('chat-opened')"
            @survey-opened="$emit('survey-opened')"
            :object
            data-tour-id="object-map-popup:footer"
        />
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
import { IndustryObject } from '@/components/ObjectMapPopup/types';
import { useTour } from '@/composables/useTour/useTour';
import { createTourStepElementGenerator } from '@/composables/useTour/useTourStep';

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
    class: number | string | null;
    is_land: number;
    test_only: number | null;
    object_type: number | null;
};

defineEmits<{
    (e: 'close'): void;
    (e: 'chat-opened'): void;
    (e: 'survey-opened'): void;
}>();

defineProps<{
    object: IndustryObject;
}>();

const createTourStepElement = createTourStepElementGenerator('object-map-popup');

useTour('object-map-popup', {
    autorun: true,
    steps: [
        {
            key: 0,
            element: createTourStepElement('wrapper'),
            popover: {
                title: 'Карточка объекта',
                description: 'Теперь информация об объекте выводится в карточке на карте.',
                side: 'right',
                align: 'start'
            }
        },
        {
            key: 1,
            element: createTourStepElement('slider'),
            popover: {
                title: 'Галерея фотографий',
                description:
                    'Просматривать фотографии объекта можно как и в выдаче, с помощью галереи.',
                side: 'right',
                align: 'start'
            }
        },
        {
            key: 2,
            element: createTourStepElement('offer'),
            popover: {
                title: 'Предложение на объекте',
                description:
                    'В карточке отображаются только актуальные предложения (площадь и цена). Можно кликнуть на предложение, чтобы узнать больше или скачать презентацию.',
                side: 'right',
                align: 'start'
            }
        },
        {
            key: 3,
            element: createTourStepElement('footer'),
            popover: {
                title: 'Действия',
                description:
                    'Перейти в комплекс/чат или начать опрос вы можете с помощью действий в конце карточки.',
                side: 'right',
                align: 'start'
            }
        }
    ]
});
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
