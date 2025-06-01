<template>
    <SurveyForm
        v-for="form in manager.forms"
        :key="form.id"
        @close="closeForm(form.id)"
        :survey="form.survey"
        :company-id="form.companyId"
    />
</template>
<script setup>
import SurveyForm from '@/components/SurveyForm/SurveyForm.vue';
import { getSurveyFormManager } from '@/composables/useSurveyForm.js';

const manager = getSurveyFormManager();

function closeForm(id) {
    manager.closeSurvey(id);
}
</script>
