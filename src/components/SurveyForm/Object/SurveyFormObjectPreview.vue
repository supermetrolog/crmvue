<template>
    <div class="survey-form-object__preview">
        <OfferTableItemPreviewMotionSlider :thumb="object.thumb" :photos="object.photo ?? []" />
        <div class="survey-form-object__preview-header">
            <span class="messenger-dialog-offer__id">ID {{ object.id }}</span>
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
        <div v-if="answer" class="survey-form-object__preview-footer">
            <UiField
                small
                color="light"
                class="survey-form-object__preview-label"
                :style="{ backgroundColor: answerColor, color: 'white' }"
            >
                {{ answerLabel }}
            </UiField>
        </div>
    </div>
</template>
<script setup>
import OfferTableItemPreviewMotionSlider from '@/components/Offer/TableItem/OfferTableItemPreviewMotionSlider.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import UiField from '@/components/common/UI/UiField.vue';
import { computed } from 'vue';

defineEmits(['show-preview', 'show-map']);
const props = defineProps({
    object: {
        type: Object,
        required: true
    },
    answer: [Number, String]
});

const answer = computed(() => Number(props.answer));

const answerToLabel = {
    1: 'Без изменений',
    2: 'Не актуально',
    3: 'Не опросил',
    4: 'Обработан',
    5: 'Объект продан',
    6: 'Объект снесен',
    7: 'Новые предложения'
};

const answerLabel = computed(() => answerToLabel[answer.value]);

const answerToColor = {
    1: '#8e8e8e',
    2: '#f80200',
    3: '#8e8e8e',
    4: '#12b780',
    5: '#f80200',
    6: '#f80200',
    7: '#fd8422'
};

const answerColor = computed(() => answerToColor[answer.value]);
</script>
