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
            <UiField small color="light" class="fs-1">
                <i :class="icon" />
                <span>{{ answerLabel }}</span>
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

const answerLabel = computed(() => {
    if (Number(props.answer) === 1) return 'Без изменений';
    if (Number(props.answer) === 2) return 'Не актуально';
    return 'Не опросил';
});

const icon = computed(() => {
    if (Number(props.answer) === 1) return 'fa-solid fa-thumbs-up';
    if (Number(props.answer) === 2) return 'fa-solid fa-thumbs-down';
    return 'fa-solid fa-phone-slash';
});
</script>
