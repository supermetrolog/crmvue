<template>
    <teleport to="body">
        <PhoneNumberPopup />
        <Confirm />
        <SurveyFormManager />
        <SurveyPreview />
        <MinimizeModalManager />
        <FormModalTask />
    </teleport>
</template>
<script setup>
import PhoneNumberPopup from '@/components/common/PhoneNumberPopup.vue';
import Confirm from '@/components/common/Confirm.vue';
import FormModalTask from '@/components/Forms/FormModalTask.vue';
import SurveyPreview from '@/components/Survey/SurveyPreview.vue';
import SurveyFormManager from '@/components/SurveyForm/SurveyFormManager.vue';
import MinimizeModalManager from '@/components/common/UI/MinimizeModalManager.vue';
</script>
