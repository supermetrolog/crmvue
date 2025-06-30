<template>
    <div class="survey-form-contact-form">
        <SurveyFormContactFormCard
            :contact
            class="survey-form-contact-form__card"
            data-tour-id="survey-form:stepper-contact-info"
        />
        <SurveyFormContactFormCall
            :key="contact.id"
            v-model="form"
            @change="$emit('change')"
            @schedule-call="$emit('schedule-call')"
            @schedule-visit="$emit('schedule-visit')"
            @schedule-event="$emit('schedule-event')"
            :contact
            class="survey-form-contact-form__call"
        />
        <div class="survey-form-contact-form__actions">
            <UiButtonIcon
                @click="reset"
                icon="fa-solid fa-rotate-left"
                label="Сбросить ответы"
                small
                color="light"
            />
            <UiButtonIcon
                @click="$emit('close')"
                icon="fa-solid fa-close"
                label="Закрыть"
                small
                color="light"
            />
        </div>
    </div>
</template>
<script setup>
import SurveyFormContactFormCard from '@/components/SurveyForm/SurveyFormContactFormCard.vue';
import SurveyFormContactFormCall from '@/components/SurveyForm/SurveyFormContactFormCall.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';

defineEmits(['schedule-call', 'change', 'close', 'schedule-visit', 'schedule-event']);
defineProps({
    contact: {
        type: Object,
        required: true
    }
});

const form = defineModel({ type: Object, default: () => ({}) });

function reset() {
    form.value.available = null;
    form.value.reason = null;
    form.value.description = null;
}
</script>
