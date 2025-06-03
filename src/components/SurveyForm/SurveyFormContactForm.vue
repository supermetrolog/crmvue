<template>
    <div class="survey-form-contact-form">
        <SurveyFormContactFormCard :contact class="survey-form-contact-form__card" />
        <SurveyFormContactFormCall
            :key="contact.id"
            v-model="form"
            @change="$emit('change')"
            @schedule-call="$emit('schedule-call')"
            :contact
            class="survey-form-contact-form__call"
        />
    </div>
</template>
<script setup>
import SurveyFormContactFormCard from '@/components/SurveyForm/SurveyFormContactFormCard.vue';
import SurveyFormContactFormCall from '@/components/SurveyForm/SurveyFormContactFormCall.vue';

defineEmits(['schedule-call', 'change']);
defineProps({
    contact: {
        type: Object,
        required: true
    }
});

const form = defineModel({ type: Object, default: () => ({}) });
</script>
