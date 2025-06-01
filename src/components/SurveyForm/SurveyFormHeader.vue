<template>
    <div>
        <SurveyFormHeaderCompany
            @update-company="$emit('update-company')"
            @update-logo="$emit('update-logo', $event)"
            :company
            :last-surveys
            :surveys-count
        />
    </div>
</template>
<script setup>
import SurveyFormHeaderCompany from '@/components/SurveyForm/SurveyFormHeaderCompany.vue';

defineEmits(['update-logo', 'update-company']);
defineProps({
    company: {
        type: Object,
        required: true
    },
    lastSurveys: {
        type: Array,
        default: () => []
    },
    surveysCount: {
        type: Number,
        default: 0
    }
});
</script>
