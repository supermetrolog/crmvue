import { shallowReactive } from 'vue';
import { spliceById } from '@/utils/helpers/array/spliceById.js';
import { notify } from '@kyvg/vue3-notification';

const forms = shallowReactive([]);

let uid = 0;

function generateId() {
    uid++;

    return uid;
}

function closeSurveyForm(formId) {
    spliceById(forms, formId);
}

function openSurveyForm(companyId) {
    if (forms.some(form => Number(form.companyId) === Number(companyId))) {
        notify({
            group: 'app',
            type: 'info',
            duration: 3000,
            title: 'Опрос клиента',
            text: 'Опрос с этим клиентом уже запущен. Проверьте свернутые опросы.'
        });

        return;
    }

    forms.push({ id: generateId(), companyId });
}

function showSurveyForm(surveyId) {
    // TODO: Show
}

export function getSurveyFormManager() {
    return {
        forms,
        closeSurvey: closeSurveyForm
    };
}

export function useSurveyForm() {
    return {
        openSurvey: openSurveyForm,
        showSurvey: showSurveyForm
    };
}
