<template>
    <div class="survey-form-contact-form-sending">
        <UiForm>
            <UiFormGroup>
                <UiCol :cols="12" data-tour-id="survey-letter-sending:letter-select">
                    <div class="d-flex align-items-end gap-2">
                        <MultiSelect
                            v-model="selectedLetterId"
                            :options="currentLettersOptions"
                            class="flex-grow-1"
                            placeholder="Выберите письмо для просмотра.."
                            :disabled="currentLetters.length === 0"
                        >
                            <template #singlelabel="{ value }">
                                <span>{{ value.label }}</span>
                                <span
                                    v-if="value.after"
                                    :class="value.afterClass"
                                    class="ml-1 font-weight-semi"
                                >
                                    {{ value.after }}
                                </span>
                            </template>
                        </MultiSelect>
                        <UiButton
                            @click="selectedLetterId = null"
                            :disabled="!selectedLetterId"
                            icon="fa-solid fa-plus flex-shrink-0"
                            color="success-light"
                        >
                            Новое письмо
                        </UiButton>
                    </div>
                </UiCol>
            </UiFormGroup>
            <UiFormDivider />
            <AnimationTransition :speed="0.3">
                <div v-if="selectedLetterId">
                    <AnimationTransition :speed="0.3">
                        <SurveyFormContactFormSendingLetter
                            :key="selectedLetterId"
                            :letter="selectedLetter"
                            class="mb-2"
                        />
                    </AnimationTransition>
                    <UiFormDivider />
                    <SurveyFormContactFormSendingChecking
                        v-if="formIsVisible"
                        v-model="form"
                        @schedule-call="$emit('schedule-call')"
                        @schedule-visit="$emit('schedule-visit')"
                        @schedule-event="$emit('schedule-event')"
                        :letter="selectedLetter"
                        :company
                        :contact
                        :survey-action="targetLetterAction"
                        :scheduled
                        :visit
                        :event
                    />
                </div>
                <div v-else data-tour-id="survey-letter-sending:form">
                    <Loader v-if="isLoading" label="Отправка письма" />
                    <UiFormGroup>
                        <UiCol :cols="12">
                            <div class="d-flex">
                                <p class="font-weight-semi">Новое письмо клиенту</p>
                                <UiButtonIcon
                                    @click.prevent="runTour"
                                    mini
                                    class="ml-2 d-inline-block"
                                    color="light"
                                    label="Как работать с письмами?"
                                    icon="fa-solid fa-question"
                                />
                            </div>
                        </UiCol>
                        <UiInput
                            v-model="subject"
                            :v="v$.subject"
                            required
                            placeholder="Тема письма"
                            class="col-12 font-weight-semi"
                            data-tour-id="survey-letter-sending:subject"
                        >
                            <div
                                class="d-flex gap-2 mt-2 font-weight-normal"
                                data-tour-id="survey-letter-sending:subject-templates"
                            >
                                <UiButton
                                    @click="setSubject(SUBJECTS.SUGGESTION)"
                                    :disabled="subject === SUBJECTS.SUGGESTION"
                                    mini
                                    color="light"
                                    icon="fa-solid fa-tag"
                                >
                                    RE: Предложение по помещениям
                                </UiButton>
                                <UiButton
                                    @click="setSubject(SUBJECTS.RENEWAL)"
                                    :disabled="subject === SUBJECTS.RENEWAL"
                                    mini
                                    color="light"
                                    icon="fa-solid fa-tag"
                                >
                                    Возобновление сотрудничества
                                </UiButton>
                                <UiButton
                                    @click.prevent="setSubject(null)"
                                    :disabled="subject === null"
                                    icon="fa-solid fa-trash"
                                    mini
                                    color="danger-light"
                                    class="ml-auto"
                                >
                                    Очистить
                                </UiButton>
                            </div>
                        </UiInput>
                    </UiFormGroup>
                    <UiFormDivider />
                    <UiFormGroup>
                        <VueEditor
                            v-model="message"
                            :min-height="100"
                            :max-height="300"
                            :v="v$.message"
                            :loading="templateLoading"
                            loading-label="Генерация сообщения.."
                            required
                            placeholder="Содержание письма.."
                            class="col-12"
                            data-tour-id="survey-letter-sending:message"
                        >
                            <template #after>
                                <div
                                    class="d-flex mt-2"
                                    data-tour-id="survey-letter-sending:signature"
                                >
                                    <UiCheckbox
                                        v-model="showSignature"
                                        data-tour-id="survey-letter-sending:signature-checkbox"
                                    >
                                        <span class="d-flex align-items-center gap-1">
                                            <span>Прикрепить автоматическую подпись</span>
                                            <Tippy :delay="200">
                                                <UiButtonIcon
                                                    @click.prevent
                                                    icon="fa-solid fa-question"
                                                    color="light"
                                                    mini
                                                />
                                                <template #content>
                                                    <p class="mb-3">
                                                        Подпись генерируется системой. Для изменения
                                                        подписи воспользуйтесь кнопкой "Вставить
                                                        подпись вручную".
                                                    </p>
                                                    <p class="mb-2 font-weight-semi">
                                                        Ваша подпись:
                                                    </p>
                                                    <div class="signature" v-html="signature"></div>
                                                </template>
                                            </Tippy>
                                        </span>
                                    </UiCheckbox>
                                    <UiButton
                                        @click.prevent="copySignature"
                                        mini
                                        :color="showSignature ? 'light' : 'success-light'"
                                        icon="fa-solid fa-pen"
                                        class="ml-auto"
                                        data-tour-id="survey-letter-sending:signature-button"
                                    >
                                        Вставить подпись вручную
                                    </UiButton>
                                    <UiButton
                                        @click.prevent="message = null"
                                        mini
                                        :disabled="!message"
                                        color="danger-light"
                                        icon="fa-solid fa-trash"
                                        class="ml-1"
                                    >
                                        Очистить текст
                                    </UiButton>
                                </div>
                            </template>
                        </VueEditor>
                    </UiFormGroup>
                    <UiFormGroup>
                        <UiCol :cols="12">
                            <UiButton
                                @click.prevent="submit"
                                color="success"
                                icon="fa-solid fa-paper-plane"
                                icon-class="mr-1"
                                :disabled="!canBeSend"
                            >
                                Отправить
                            </UiButton>
                        </UiCol>
                    </UiFormGroup>
                </div>
            </AnimationTransition>
        </UiForm>
        <SurveyFormContactFormSendingTour ref="tourEl" />
    </div>
</template>
<script setup>
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';
import { computed, onBeforeMount, onMounted, ref, useTemplateRef, watch } from 'vue';
import { useAuth } from '@/composables/useAuth';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import { isNotEmptyString } from '@/utils/helpers/string/isNotEmptyString.js';
import api from '@/api/api.js';
import { useNotify } from '@/utils/use/useNotify.js';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import { toDateFormat } from '@/utils/formatters/date';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import SurveyFormContactFormSendingChecking from '@/components/SurveyForm/SurveyFormContactFormSendingChecking.vue';
import SurveyFormContactFormSendingLetter from '@/components/SurveyForm/SurveyFormContactFormSendingLetter.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import Loader from '@/components/common/Loader.vue';
import UiCheckbox from '@/components/common/Forms/UiCheckbox.vue';
import { Tippy } from 'vue-tippy';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import { useCachedRef } from '@/composables/useCachedRef';
import SurveyFormContactFormSendingTour from '@/components/SurveyForm/SurveyFormContactFormSendingTour.vue';

const emit = defineEmits(['change', 'schedule-call', 'schedule-visit', 'schedule-event']);

const props = defineProps({
    contact: {
        type: Object,
        required: true
    },
    company: Object,
    survey: Object,
    emailId: Number,
    letterActions: {
        type: Array,
        required: true
    },
    scheduled: Boolean,
    visit: Boolean,
    event: Boolean,
    template: String,
    templateLoading: Boolean
});

const form = defineModel({ type: Object, default: () => ({}) });

const canBeSend = computed(
    () =>
        isNotNullish(subject.value) &&
        isNotNullish(message.value) &&
        isNotEmptyString(subject.value) &&
        isNotEmptyString(message.value)
);

const currentEmail = computed(() => props.contact.emails.find(email => email.id === props.emailId));

// letters

const currentLetters = computed(() =>
    props.contact.letters.filter(letter => letter.email === currentEmail.value.email)
);

function formatLetterSubject(subject) {
    return subject.length > 30 ? `${subject.slice(0, 30)}...` : subject;
}

const currentLettersOptions = computed(() =>
    currentLetters.value.map(letter => ({
        label: `Письмо "${formatLetterSubject(letter.letter.subject)}" (#${letter.letter.id}) от ${toDateFormat(letter.letter.created_at)}`,
        value: letter.id,
        after: letter.answers.length ? '- Есть ответ' : '- Нет ответа',
        afterClass: letter.answers.length ? 'text-success' : 'text-danger'
    }))
);

const selectedLetterId = ref(null);

const selectedLetter = computed(() =>
    currentLetters.value.find(letter => selectedLetterId.value === letter.id)
);

// subject

const SUBJECTS = {
    RENEWAL: 'Возобновление сотрудничества с RAYS ARMA',
    SUGGESTION: 'RE: Предложение по складским помещениям от RAYS ARMA'
};

function setSubject(value) {
    subject.value = value;
}

const subject = ref(null);

// message

const { currentUser, currentUserIsDirector } = useAuth();

const message = ref(null);

watch(
    () => props.templateLoading,
    value => {
        if (value) {
            message.value = null;
        } else {
            message.value = props.template;
        }
    }
);

// validation

const v$ = useVuelidate(
    {
        subject: {
            required: helpers.withMessage('Укажите тему письма', required)
        },
        message: {
            required: helpers.withMessage('Заполните текст письма', required)
        }
    },
    {
        message,
        subject
    }
);

// signature

const signature = computed(() => {
    const messageAuthor = `<p>С уважением, <strong>${currentUser.value.userProfile.medium_name}</strong></p>`;
    const messageAuthorPosition = `<p style="color:#c1c1c1">${currentUserIsDirector.value ? 'Директор' : 'Менеджер'} по индустриальной недвижимости</p>`;

    let messageText = `<p>`;

    if (currentUser.value.userProfile.phones.length) {
        messageText +=
            '<strong>Моб: ' + `${currentUser.value.userProfile.phones[0].phone}</strong>, `;
    }

    messageText += 'офис: +7 (495) 150-03-23';

    messageText += '</p><p>';

    if (currentUser.value.userProfile.emails.length) {
        messageText += `Эл. почта: <a href="mailto:${currentUser.value.userProfile.emails[0].email}">${currentUser.value.userProfile.emails[0].email}</a>, `;
    }

    messageText += 'веб.сайт: <a href="www.raysarma.ru">www.raysarma.ru</a></p>';

    return `<p></p>` + messageAuthor + messageAuthorPosition + messageText;
});

const showSignature = useCachedRef('ui:survey:show-signature', true);

function copySignature() {
    showSignature.value = false;

    if (isNotNullish(message.value)) {
        message.value += signature.value;
    } else {
        message.value = signature.value;
    }

    notify.info('Подпись прикреплена в сообщение письма');
}

// letters

const targetLetterActions = computed(() =>
    props.letterActions.filter(action =>
        currentLetters.value.some(letter => letter.id === action.target_id)
    )
);

const targetLetters = computed(() =>
    currentLetters.value.filter(letter =>
        targetLetterActions.value.some(
            action => action.target_id === letter.id && action.status === 'pending'
        )
    )
);

const targetLetterAction = computed(() => {
    return targetLetterActions.value.find(action => selectedLetterId.value === action.target_id);
});

const formIsVisible = computed(() =>
    targetLetters.value.some(letter => selectedLetterId.value === letter.id)
);

onBeforeMount(() => {
    if (currentLetters.value.length && targetLetterActions.value.length) {
        const latestLetterAction = targetLetterActions.value.reduce(
            (max, action) => (action.id > max.id ? action : max),
            props.letterActions[0]
        );

        selectedLetterId.value = latestLetterAction.target_id;
    }

    if (!props.templateLoading && props.template) {
        message.value = props.template;
    }
});

onMounted(() => {
    if (!selectedLetterId.value) {
        softRunTour();
    }
});

function createPayload() {
    return {
        emails: [
            {
                contact_id: props.contact.id,
                value: props.contact.emails.find(email => email.id === props.emailId).email
            }
        ],
        shipping_method: 1,
        body: message.value,
        ways: [0],
        subject: subject.value,
        company_id: props.company?.id ?? props.contact.company_id,
        show_signature: showSignature.value
    };
}

const isLoading = ref(false);

const notify = useNotify();

async function submit() {
    isLoading.value = true;

    emit('change');

    try {
        await api.letter.send(createPayload());

        const contact = await api.contacts.get(props.contact.id);

        Object.assign(props.contact, contact);

        selectedLetterId.value = contact.letters[0]?.id;

        void createSurveyAction();

        notify.success('Сообщение успешно отправлено');
    } finally {
        isLoading.value = false;
    }
}

async function createSurveyAction() {
    const action = await api.survey.createAction(props.survey.id, {
        type: 'letter',
        status: 'pending',
        target_id: selectedLetterId.value
    });

    // eslint-disable-next-line vue/no-mutating-props
    props.survey.actions.push(action);
}

watch(selectedLetterId, () => {
    if (formIsVisible.value) {
        form.value.available = null;
        form.value.reason = null;
    }
});

// tour

const tourEl = useTemplateRef('tourEl');

function runTour() {
    tourEl.value.run();
}

function softRunTour() {
    tourEl.value.softRun();
}
</script>
<style>
.signature a {
    color: #89bbf4;
    text-decoration: underline;
}
</style>
