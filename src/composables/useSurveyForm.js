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
    const openedSurvey = forms.find(form => Number(form.companyId) === Number(companyId));

    if (openedSurvey) {
        notify({
            group: 'app',
            type: 'info',
            duration: 3000,
            title: 'Опрос клиента',
            text: 'Опрос с этим клиентом уже запущен. Открыт из свернутого режима.'
        });

        openedSurvey.expand();

        return;
    }

    forms.push({ id: generateId(), companyId });
}

function editSurvey(survey) {
    if (forms.some(form => Number(form.companyId) === Number(survey.chatMember?.model_id))) {
        notify({
            group: 'app',
            type: 'info',
            duration: 3000,
            title: 'Опрос клиента',
            text: 'Опрос с этим клиентом уже запущен. Проверьте свернутые опросы.'
        });

        return;
    }

    forms.push({ id: generateId(), survey, companyId: survey.chatMember?.model_id });
}

function markAsMinimized(formId, onExpandHandler) {
    const surveyForm = forms.find(form => Number(form.id) === Number(formId));
    if (!surveyForm) return;

    surveyForm.minimized = true;
    surveyForm.expand = () => {
        surveyForm.minimized = false;
        if (typeof onExpandHandler === 'function') onExpandHandler();
    };
}

export function getSurveyFormManager() {
    return {
        forms,
        closeSurvey: closeSurveyForm,
        markAsMinimized
    };
}

export function useSurveyForm() {
    return {
        openSurvey: openSurveyForm,
        editSurvey
    };
}
