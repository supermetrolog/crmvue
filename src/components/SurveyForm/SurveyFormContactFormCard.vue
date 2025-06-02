<template>
    <div class="survey-form-contact-form-card">
        <div class="survey-form-contact-form-card__content">
            <p class="survey-form-contact-form-card__username">
                <UiTooltipIcon
                    v-if="contact.isMain"
                    tooltip="Основной контакт"
                    icon="fa-solid fa-crown"
                    class="mr-1 text-warning"
                />
                <UiTooltipIcon
                    v-if="contact.faceToFaceMeeting"
                    tooltip="Была личная (очная) встреча"
                    icon="fa-solid fa-street-view"
                    class="mr-1 text-success_alt"
                />
                <UiTooltipIcon
                    v-if="contact.good"
                    tooltip="Хорошие взаимоотношения"
                    icon="fa-regular fa-face-smile-beam"
                    class="mr-1 text-success_alt"
                />
                <Tippy interactive :interactive-border="20">
                    <template #default>
                        <span>{{ contact.full_name }}</span>
                    </template>
                    <template #content>
                        <ContactCard :contact />
                    </template>
                </Tippy>
            </p>
            <p class="survey-form-contact-form-card__staff">
                <span v-if="contact.position_unknown" class="text-grey">
                    Должность неизвестна..
                </span>
                <span v-else-if="contact.position" class="text-grey">
                    {{ position }}
                </span>
                <span v-else class="color-error">Должность не заполнена!</span>
            </p>
        </div>
        <div class="mt-1 survey-form-contact-form-card__contacts">
            <div class="d-flex flex-column gap-1">
                <p v-for="phone of contact.phones" :key="phone.id">
                    <span>Телефон: </span>
                    <PhoneNumber
                        :phone="phone"
                        clickable
                        class="survey-form-contact-form-card__phone"
                    />
                </p>
                <p v-if="!contact.phones.length">
                    <span>Телефон: </span>
                    <span class="text-danger">не заполнено</span>
                </p>
            </div>
            <div class="d-flex flex-column gap-1">
                <p v-for="email in contact.emails" :key="email.id">
                    <span>Почта: </span>
                    <span class="survey-form-contact-form-card__phone">
                        <span>{{ email.email }}</span>
                    </span>
                </p>
                <p v-if="!contact.emails.length">
                    <span>Почта: </span>
                    <span class="text-danger">не заполнено</span>
                </p>
            </div>
        </div>
        <p class="survey-form-contact-form-card__calls mt-2">
            <i class="fa-solid fa-phone survey-form-contact-form-card__icon mr-1" />
            <span class="font-weight-semi">{{ callsPluralLabel }}</span>
            <span v-if="contact.calls?.length" class="text-danger">
                Последнее общение {{ lastCallDate }}
            </span>
        </p>
        <p v-if="lastThreeCallsIsUnavailable" class="text-danger">
            <i>Не удалось дозвониться уже более 3х раз подряд!</i>
        </p>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import PhoneNumber from '@/components/common/PhoneNumber.vue';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';
import { contactOptions } from '@/const/options/contact.options.js';
import { plural } from '@/utils/plural.js';
import { toBeautifulDateFormat } from '@/utils/formatters/date.js';
import ContactCard from '@/components/Contact/Card/ContactCard.vue';
import { Tippy } from 'vue-tippy';

const emit = defineEmits(['schedule-call']);
const props = defineProps({
    contact: {
        type: Object,
        required: true
    }
});

const position = computed(() => contactOptions.position[props.contact.position]);

const callsPluralLabel = computed(() => {
    const count = props.contact.calls?.length ?? 0;

    if (count > 0) {
        return `Всего ${plural(count, '%d звонок', '%d звонка', '%d звонков')}.`;
    }

    return 'Нет звонков..';
});

const lastCallDate = computed(() => {
    const lastCall = props.contact.calls[0];

    return toBeautifulDateFormat(lastCall.created_at);
});

const lastThreeCallsIsUnavailable = computed(() => {
    if (props.contact.calls.length >= 3) {
        return props.contact.calls.slice(0, 3).every(element => element.status === 0);
    }

    return false;
});
</script>
