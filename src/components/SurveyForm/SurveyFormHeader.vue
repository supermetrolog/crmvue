<template>
    <div>
        <SurveyFormHeaderCompany
            @update-company="$emit('update-company')"
            @update-logo="$emit('update-logo', $event)"
            @to-chat="$emit('to-chat')"
            :company
            :last-surveys
            :surveys-count
            editable
        />
    </div>
</template>
<script setup>
import SurveyFormHeaderCompany from '@/components/SurveyForm/SurveyFormHeaderCompany.vue';

defineEmits(['update-logo', 'update-company', 'to-chat']);
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
