<template>
    <div class="messenger-quiz-question-template-offer" :class="{ disabled: disabled }">
        <div class="messenger-quiz-question-template-offer__body">
            <MessengerQuizFormTemplateOfferMixPreviewImages
                @show-preview="$emit('show-preview')"
                :offer="offerMix.offers[0]"
            />
            <MessengerQuizFormTemplateOfferMixPreviewContent :offer="offerMix.offers[0]" />
        </div>
        <Tabs
            class="mt-2"
            nav-class="messenger-quiz-question-template-offer__tabs"
            nav-item-link-class="messenger-quiz-question-template-offer__tab"
        >
            <MessengerQuizFormTemplateOfferMixPreviewOffer
                v-for="offer in offerMix.offers"
                :key="offer.id"
                :offer="offer"
            />
        </Tabs>
    </div>
</template>
<script setup>
import MessengerQuizFormTemplateOfferMixPreviewContent from '@/components/Messenger/Quiz/Form/Template/OfferMix/MessengerQuizFormTemplateOfferMixPreviewContent.vue';
import MessengerQuizFormTemplateOfferMixPreviewImages from '@/components/Messenger/Quiz/Form/Template/OfferMix/MessengerQuizFormTemplateOfferMixPreviewImages.vue';
import MessengerQuizFormTemplateOfferMixPreviewOffer from '@/components/Messenger/Quiz/Form/Template/OfferMix/MessengerQuizFormTemplateOfferMixPreviewOffer.vue';
import Tabs from '@/components/common/Tabs/Tabs.vue';

defineEmits(['show-preview']);
defineProps({
    offerMix: {
        type: Object,
        required: true
    },
    disabled: Boolean
});
</script>
