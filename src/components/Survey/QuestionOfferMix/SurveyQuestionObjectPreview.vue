<template>
    <div class="messenger-quiz-question-template-offer__preview">
        <OfferTableItemPreviewMotionSlider :thumb="object.thumb" :photos="object.photo ?? []" />
        <div class="messenger-quiz-question-template-offer__preview-header">
            <span class="messenger-dialog-offer__id">{{ object.id }}</span>
            <UiButtonIcon
                @click.stop.prevent="$emit('show-preview')"
                small
                label="Открыть просмотр фото"
                class="bg-white"
                icon="fa-solid fa-image"
            />
        </div>
        <div class="messenger-quiz-question-template-offer__chips">
            <UiButtonIcon
                v-if="object.agent_visited"
                label="Был на объекте"
                small
                class="bg-white"
                icon="fa-solid fa-person-walking"
            />
        </div>
    </div>
</template>
<script setup>
import OfferTableItemPreviewMotionSlider from '@/components/Offer/TableItem/OfferTableItemPreviewMotionSlider.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';

defineEmits(['show-preview']);
defineProps({
    object: {
        type: Object,
        required: true
    }
});
</script>
