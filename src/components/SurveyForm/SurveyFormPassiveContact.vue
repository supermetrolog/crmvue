<template>
    <div class="survey-form-contact">
        <div class="survey-form-contact__row">
            <SurveyFormContactCard
                @click="$emit('select')"
                @edit="$emit('edit')"
                @show-comments="$emit('show-comments')"
                :active
                :contact
                full
                class="survey-form-contact__element"
            />
        </div>
        <AnimationTransition :speed="0.5">
            <div v-if="active" class="survey-form-contact-form mt-2 mb-4">
                <SurveyFormContactFormCard :contact class="survey-form-contact-form__card" />
            </div>
        </AnimationTransition>
    </div>
</template>
<script setup>
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import SurveyFormContactCard from '@/components/SurveyForm/SurveyFormContactCard.vue';
import SurveyFormContactFormCard from '@/components/SurveyForm/SurveyFormContactFormCard.vue';

defineEmits(['edit', 'show-comments', 'select', 'close']);

defineProps({
    contact: {
        type: Object,
        required: true
    },
    loading: Boolean,
    active: Boolean,
    disabled: Boolean
});
</script>
