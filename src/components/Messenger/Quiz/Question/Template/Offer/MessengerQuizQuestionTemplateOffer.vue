<template>
    <div class="messenger-quiz-question-template-offer">
        <slot name="before" />
        <div class="messenger-quiz-question-template-offer__body">
            <slot name="aside" />
            <MessengerQuizQuestionTemplateOfferPreview
                @show-preview="$emit('show-preview')"
                :offer
            />
            <MessengerQuizQuestionTemplateOfferContent :offer />
        </div>
        <div
            class="messenger-quiz-question-template-offer__footer"
            :class="{ 'pl-4': $slots.aside }"
        >
            <MessengerQuizQuestionTemplateOfferAreas :offer />
            <MessengerQuizQuestionTemplateOfferPrices :offer />
        </div>
        <div v-if="$slots.after" :class="{ 'ml-4': $slots.aside }">
            <slot name="after" />
        </div>
    </div>
</template>
<script setup>
import MessengerQuizQuestionTemplateOfferPrices from '@/components/Messenger/Quiz/Question/Template/Offer/MessengerQuizQuestionTemplateOfferPrices.vue';
import MessengerQuizQuestionTemplateOfferAreas from '@/components/Messenger/Quiz/Question/Template/Offer/MessengerQuizQuestionTemplateOfferAreas.vue';
import MessengerQuizQuestionTemplateOfferContent from '@/components/Messenger/Quiz/Question/Template/Offer/MessengerQuizQuestionTemplateOfferContent.vue';
import MessengerQuizQuestionTemplateOfferPreview from '@/components/Messenger/Quiz/Question/Template/Offer/MessengerQuizQuestionTemplateOfferPreview.vue';

defineEmits(['show-preview']);
defineProps({
    offer: {
        type: Object,
        required: true
    }
});
</script>
