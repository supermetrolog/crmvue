<template>
    <div class="survey-form-contact-form">
        <div class="survey-form-contact-form__header"></div>
        <div class="survey-form-contact-form__content">
            <div
                class="survey-form-contact-form__list"
                data-tour-id="survey-form:stepper-contact-info"
            >
                <SurveyFormContactFormPhone
                    v-for="phone in contact.phones"
                    :key="phone.id"
                    @click="selectWay('phone', phone.id)"
                    :phone="phone"
                    :contact
                    :active="selectedWay === 'phone' && selectedWayId === phone.id"
                    :form="form?.phones?.[phone.id]"
                />
                <SurveyFormContactFormEmail
                    v-for="email in contact.emails"
                    :key="email.id"
                    @click="selectWay('email', email.id)"
                    :email="email"
                    :contact
                    :active="selectedWay === 'email' && selectedWayId === email.id"
                    :letter-actions
                    :form="form?.emails?.[email.id]"
                />
            </div>
            <div class="survey-form-contact-form__call">
                <AnimationTransition :speed="0.35">
                    <SurveyFormContactFormCall
                        v-if="hasSelectedWay && selectedWay === 'phone'"
                        :key="`phone-${formKey}`"
                        v-model="form.phones[selectedWayId]"
                        @change="$emit('change')"
                        @schedule-call="$emit('schedule-call')"
                        @schedule-visit="$emit('schedule-visit')"
                        @schedule-event="$emit('schedule-event')"
                        :contact
                        :company
                        :phone-id="selectedWayId"
                        :scheduled="!!form.scheduled"
                        :event="!!form.event"
                        :visit="!!form.visit"
                    />
                    <SurveyFormContactFormSending
                        v-else-if="formSendingIsVisible"
                        :key="`email-${formKey}`"
                        v-model="form.emails[selectedWayId]"
                        @change="$emit('change')"
                        @schedule-call="$emit('schedule-call')"
                        @schedule-visit="$emit('schedule-visit')"
                        @schedule-event="$emit('schedule-event')"
                        :contact
                        :company
                        :email-id="selectedWayId"
                        :survey
                        :letter-actions
                        :scheduled="!!form.scheduled"
                        :event="!!form.event"
                        :visit="!!form.visit"
                        :template="emailTemplate"
                        :template-loading="emailTemplateIsLoading"
                    />
                    <SurveyFormContactFormEmpty v-else />
                </AnimationTransition>
            </div>
        </div>
    </div>
</template>
<script setup>
import SurveyFormContactFormCall from '@/components/SurveyForm/SurveyFormContactFormCall.vue';
import SurveyFormContactFormPhone from '@/components/SurveyForm/SurveyFormContactFormPhone.vue';
import SurveyFormContactFormEmail from '@/components/SurveyForm/SurveyFormContactFormEmail.vue';
import { computed, ref, watch } from 'vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import SurveyFormContactFormEmpty from '@/components/SurveyForm/SurveyFormContactFormEmpty.vue';
import SurveyFormContactFormSending from '@/components/SurveyForm/SurveyFormContactFormSending.vue';
import { isNullish } from '@/utils/helpers/common/isNullish';
import api from '@/api/api.js';
import { MessageTemplateChannelEnum, MessageTemplateKindEnum } from '@/types/message-template';

defineEmits(['schedule-call', 'change', 'close', 'schedule-visit', 'schedule-event']);

const props = defineProps({
    contact: {
        type: Object,
        required: true
    },
    company: Object,
    survey: Object
});

const form = defineModel({ type: Object, default: () => ({}) });

const actions = computed(() => props.survey?.actions ?? []);

const letterActions = computed(() => actions.value.filter(action => action.type === 'letter'));

// select

const selectedWay = ref(null);
const selectedWayId = ref(null);

function selectWay(way, id) {
    if (selectedWay.value === way && selectedWayId.value === id) {
        selectedWay.value = null;
        selectedWayId.value = null;
        return;
    }

    selectedWay.value = way;
    selectedWayId.value = id;
}

const hasSelectedWay = computed(() => selectedWay.value !== null && selectedWayId.value !== null);

const formKey = computed(() => `${props.contact.id}-${selectedWayId.value}`);

// email

const formSendingIsVisible = computed(() => hasSelectedWay.value && selectedWay.value === 'email');

const emailTemplate = ref(null);
const emailTemplateIsLoading = ref(false);

watch(formSendingIsVisible, value => {
    if (value && isNullish(emailTemplate.value)) {
        generateEmailTemplate();
    }
});

async function generateEmailTemplate() {
    emailTemplateIsLoading.value = true;

    try {
        const response = await api.messageTemplate.render(
            MessageTemplateKindEnum.RESUME_COMPANY_COOPERATION,
            {
                channel: MessageTemplateChannelEnum.EMAIL,
                contact_id: props.contact.id,
                company_id: props.company?.id ?? props.contact.company_id
            }
        );

        emailTemplate.value = response.content;
    } finally {
        emailTemplateIsLoading.value = false;
    }
}

watch(
    () => props.contact.id,
    () => {
        emailTemplate.value = null;
    }
);
</script>
