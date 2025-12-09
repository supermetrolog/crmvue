import { shallowReactive } from 'vue';
import { spliceById } from '@/utils/helpers/array/spliceById.js';
import { notify } from '@kyvg/vue3-notification';

type SurveyForm = {
    id: number;
    minimized: boolean;
    companyId: number;
    expand?: () => void;
    survey?: object;
    options?: SurveyFormOptions;
};

const forms = shallowReactive<SurveyForm[]>([]);

let uid = 0;

function generateId() {
    return uid++;
}

function closeSurveyForm(formId: number) {
    spliceById(forms, formId);
}

export type SurveyFormOptions = {
    offer_contact_id?: number;
    object_id?: number;
};

function openSurveyForm(companyId: number, options: SurveyFormOptions = {}) {
    const openedSurvey = forms.find(form => Number(form.companyId) === Number(companyId));

    if (openedSurvey) {
        notify({
            group: 'app',
            type: 'info',
            duration: 3000,
            title: 'Опрос клиента',
            text: 'Опрос с этим клиентом уже запущен. Открыт из свернутого режима.'
        });

        openedSurvey?.expand();

        return;
    }

    forms.push({ id: generateId(), companyId, minimized: false, options });
}

function editSurvey(survey: object) {
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

    forms.push({
        id: generateId(),
        survey,
        companyId: survey.chatMember?.model_id as number,
        minimized: false
    });
}

function markAsMinimized(formId: number, onExpandHandler: () => void) {
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
