<template>
    <div class="survey-form-contact-form">
        <div class="survey-form-contact-form__header">
            <p>Контакты</p>
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
                />
                <SurveyFormContactFormEmail
                    v-for="email in contact.emails"
                    :key="email.id"
                    @click="selectWay('email', email.id)"
                    :email="email"
                    :contact
                    :active="selectedWay === 'email' && selectedWayId === email.id"
                />
            </div>
            <div class="survey-form-contact-form__call">
                <AnimationTransition :speed="0.35">
                    <SurveyFormContactFormCall
                        v-if="hasSelectedWay && selectedWay === 'phone'"
                        :key="formKey"
                        v-model="form.phones[selectedWayId]"
                        @change="$emit('change')"
                        @schedule-call="$emit('schedule-call')"
                        @schedule-visit="$emit('schedule-visit')"
                        @schedule-event="$emit('schedule-event')"
                        :contact
                        :company
                        :phone-id="selectedWayId"
                    />
                    <SurveyFormContactFormSending
                        v-else-if="hasSelectedWay && selectedWay === 'email'"
                        :key="formKey"
                        v-model="form.emails[selectedWayId]"
                        @change="$emit('change')"
                        :contact
                        :company
                    />
                    <SurveyFormContactFormEmpty v-else />
                </AnimationTransition>
            </div>
        </div>
    </div>
</template>
<script setup>
import SurveyFormContactFormCall from '@/components/SurveyForm/SurveyFormContactFormCall.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import SurveyFormContactFormPhone from '@/components/SurveyForm/SurveyFormContactFormPhone.vue';
import SurveyFormContactFormEmail from '@/components/SurveyForm/SurveyFormContactFormEmail.vue';
import { computed, ref } from 'vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import SurveyFormContactFormEmpty from '@/components/SurveyForm/SurveyFormContactFormEmpty.vue';
import SurveyFormContactFormSending from '@/components/SurveyForm/SurveyFormContactFormSending.vue';

defineEmits(['schedule-call', 'change', 'close', 'schedule-visit', 'schedule-event']);

const props = defineProps({
    contact: {
        type: Object,
        required: true
    },
    company: Object
});

const form = defineModel({ type: Object, default: () => ({}) });

function reset() {
    form.value.available = null;
    form.value.reason = null;
    form.value.description = null;
}

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

const formKey = computed(() => `${props.contact.id}-${selectedWay.value}-${selectedWayId.value}`);
</script>
