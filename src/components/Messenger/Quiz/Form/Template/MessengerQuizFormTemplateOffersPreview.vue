<template>
    <div>
        <Carousel :title="`Объект #${object.id}`" :slides />
        <div class="d-flex mt-2">
            <MessengerDialogObjectPreview
                :key="object.id"
                class="messenger-quiz-form-template-offer__panel"
                :object
            />
            <div class="messenger-quiz-form-template-offer__questions">
                <SurveyQuestionObjectOffersTabs
                    :key="object.id"
                    class="messenger-quiz-form-template-offer__offers"
                    :offers="object.offerMix"
                />
                <p class="font-weight-semi fs-4">Вопросы по объекту:</p>
                <slot name="questions" />
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { getLinkFile } from '@/utils/url.js';
import MessengerDialogObjectPreview from '@/components/Messenger/Dialog/Object/MessengerDialogObjectPreview.vue';
import Carousel from '@/components/common/Carousel.vue';
import SurveyQuestionObjectOffersTabs from '@/components/Survey/QuestionOfferMix/SurveyQuestionObjectOffersTabs.vue';

const props = defineProps({
    object: {
        type: Object,
        required: true
    }
});

const slides = computed(() => {
    const items = [];

    if (props.object.thumb) {
        items.push({ id: 0, src: props.object.thumb });
    }

    return items.concat(
        props.object.photo
            .filter(element => (props.object.thumb ? !props.object.thumb.includes(element) : true))
            .map((element, key) => ({ id: key + 1, src: getLinkFile(element) }))
    );
});
</script>
