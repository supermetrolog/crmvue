<template>
    <div class="survey-form-contact-form">
        <div class="survey-form-contact-form__preview">
            <SurveyFormContactFormCard :contact class="survey-form-contact-form__card" />
            <SurveyFormContactFormCall
                :key="contact.id"
                v-model="form"
                @schedule-call="$emit('schedule-call')"
                :contact
                class="mt-2"
            />
        </div>
    </div>
</template>
<script setup>
import SurveyFormContactFormCard from '@/components/SurveyForm/SurveyFormContactFormCard.vue';
import SurveyFormContactFormCall from '@/components/SurveyForm/SurveyFormContactFormCall.vue';

defineEmits(['schedule-call']);
defineProps({
    contact: {
        type: Object,
        required: true
    }
});

const form = defineModel({ type: Object, default: () => ({}) });
</script>
