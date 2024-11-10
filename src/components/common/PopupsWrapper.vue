<template>
    <teleport to="body">
        <PhoneNumberPopup />
        <Confirm />
        <FormModalTask />
        <SurveyPreview />
    </teleport>
</template>
<script setup>
import PhoneNumberPopup from '@/components/common/PhoneNumberPopup.vue';
import Confirm from '@/components/common/Confirm.vue';
import FormModalTask from '@/components/Forms/FormModalTask.vue';
import SurveyPreview from '@/components/Survey/SurveyPreview.vue';
</script>
