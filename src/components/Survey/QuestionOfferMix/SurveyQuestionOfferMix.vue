<template>
    <div class="messenger-quiz-question-template-offer" :class="{ disabled: disabled }">
        <div class="messenger-quiz-question-template-offer__body">
            <SurveyQuestionOfferMixPreview
                @show-preview="$emit('show-preview')"
                :offer="offerMix.offers[0]"
            />
            <SurveyQuestionOfferMixContent :offer="offerMix.offers[0]" :offers="offerMix.offers" />
            <div class="messenger-quiz-question-template-offer__actions">
                <UiButtonIcon
                    @click="$emit('object-sold')"
                    icon="fa-solid fa-dollar-sign"
                    class="dashboard-bg-danger-l"
                    label="Объект продан"
                    small
                />
                <UiButtonIcon
                    @click="$emit('object-destroyed')"
                    icon="fa-solid fa-ban"
                    class="dashboard-bg-danger-l"
                    label="Объект снесен"
                    small
                />
            </div>
        </div>
    </div>
</template>
<script setup>
import SurveyQuestionOfferMixPreview from '@/components/Survey/QuestionOfferMix/SurveyQuestionOfferMixPreview.vue';
import SurveyQuestionOfferMixContent from '@/components/Survey/QuestionOfferMix/SurveyQuestionOfferMixContent.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';

defineEmits(['show-preview', 'object-sold', 'object-destroyed']);
defineProps({
    offerMix: {
        type: Object,
        required: true
    },
    disabled: Boolean
});
</script>
