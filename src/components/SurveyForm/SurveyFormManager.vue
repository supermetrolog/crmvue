<template>
    <SurveyForm
        v-for="form in manager.forms"
        :key="form.id"
        @close="closeForm(form.id)"
        @minimized="markAsMinimized(form.id, $event)"
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

function markAsMinimized(formId, handler) {
    manager.markAsMinimized(formId, handler);
}
</script>
