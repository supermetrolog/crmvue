<template>
    <div class="messenger-quiz-question-template-offer" :class="{ disabled: disabled }">
        <div class="messenger-quiz-question-template-offer__body">
            <SurveyQuestionObjectPreview @show-preview="$emit('show-preview')" :object />
            <SurveyQuestionObjectContent :object />
            <div class="messenger-quiz-question-template-offer__actions">
                <UiButtonIcon
                    @click.stop="$emit('object-sold')"
                    icon="fa-solid fa-dollar-sign"
                    class="dashboard-bg-danger-l"
                    label="Объект продан"
                    small
                />
                <UiButtonIcon
                    @click.stop="$emit('object-destroyed')"
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
import SurveyQuestionObjectPreview from '@/components/Survey/QuestionOfferMix/SurveyQuestionObjectPreview.vue';
import SurveyQuestionObjectContent from '@/components/Survey/QuestionOfferMix/SurveyQuestionObjectContent.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';

defineEmits(['show-preview', 'object-sold', 'object-destroyed']);
defineProps({
    object: {
        type: Object,
        required: true
    },
    disabled: Boolean
});
</script>
