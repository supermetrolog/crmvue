<template>
    <div class="survey-form-contact-form-sending">
        <div class="d-flex">
            <span class="text-grey">Функция в доработке..</span>
            <UiButton
                color="success"
                icon="fa-solid fa-paper-plane"
                icon-class="mr-1"
                class="ml-auto mb-2"
                disabled
            >
                Отправить
            </UiButton>
        </div>
        <UiForm @submit.prevent>
            <UiFormGroup>
                <UiInput
                    v-model="form.subject"
                    placeholder="Тема письма"
                    class="col-12 font-weight-semi"
                />
                <UiCol :cols="12">
                    <div class="d-flex gap-2">
                        <UiButton
                            @click="setSubject(SUBJECTS.RENEWAL)"
                            :disabled="form.subject === SUBJECTS.RENEWAL"
                            mini
                            color="light"
                            icon="fa-solid fa-tag"
                        >
                            Возобновление сотрудничества
                        </UiButton>
                    </div>
                </UiCol>
            </UiFormGroup>
            <UiFormGroup>
                <VueEditor
                    v-model="form.message"
                    :min-height="100"
                    :max-height="300"
                    placeholder="Содержание письма.."
                    class="col-12"
                />
            </UiFormGroup>
            <UiFormGroup></UiFormGroup>
        </UiForm>
    </div>
</template>
<script setup>
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';
import { computed, onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiCol from '@/components/common/UI/UiCol.vue';

const emit = defineEmits(['change']);

defineProps({
    contact: {
        type: Object,
        required: true
    },
    company: Object
});

const form = defineModel({ type: Object, default: () => ({}) });

const SUBJECTS = {
    RENEWAL: 'Возобновление сотрудничества с RAYS ARMA'
};

function setSubject(subject) {
    form.value.subject = subject;
}

const v$ = useVuelidate(
    {
        reason: {
            required: helpers.withMessage('Укажите тему письма', required)
        }
    },
    form
);

const { currentUser, currentUserIsDirector } = useAuth();

const letterMessage = computed(() => {
    const messageAuthor = `<p>С уважением, ${currentUser.value.userProfile.medium_name}</p>`;
    const messageAuthorPosition = `<p>${currentUserIsDirector.value ? 'Директор' : 'Менеджер'} департамента индустриальной недвижимости</p>`;

    let messageText = `<p>`;

    if (currentUser.value.userProfile.phones.length) {
        messageText +=
            'Моб: ' +
            `<a href="tel:${currentUser.value.userProfile.phones[0].phone.replace(/\D/g, '')}">${currentUser.value.userProfile.phones[0].phone}</a> `;
    }

    messageText += 'тел.офис: <a href="tel:74951500323">+7 (495) 150-03-23</a>';

    if (currentUser.value.userProfile.caller_id) {
        messageText += ' доб. ' + currentUser.value.userProfile.caller_id;
    }

    messageText += '</p><p>';

    if (currentUser.value.userProfile.emails.length) {
        messageText += `Эл. почта: <a href="mailto:${currentUser.value.userProfile.emails[0].email}">${currentUser.value.userProfile.emails[0].email}</a>, `;
    }

    messageText += 'веб.сайт: <a href="www.raysarma.ru">www.raysarma.ru</a></p>';

    return `<p></p>` + messageAuthor + messageAuthorPosition + messageText;
});

onMounted(() => {
    form.value.message = letterMessage.value;
});
</script>
