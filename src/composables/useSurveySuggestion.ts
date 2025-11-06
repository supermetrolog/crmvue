import { Task, TaskRelationEntityModelTypeEnum } from '@/types/task';
import api from '@/api/api';
import { isCallTask } from '@/modules/task/model';
import { useSurveyForm } from '@/composables/useSurveyForm';
import { useConfirm } from '@/composables/useConfirm';
import { createSharedComposable } from '@vueuse/core';
import { getCompanyName } from '@/utils/formatters/models/company';

export const useSurveySuggestion = createSharedComposable(() => {
    const { openSurvey } = useSurveyForm();
    const { confirm } = useConfirm();

    async function suggestSurveyByTask(task: Task) {
        if (!isCallTask(task)) {
            return;
        }

        const relations = await api.task.getRelations(task.id);
        const company = relations.find(
            relation => relation.entity_type === TaskRelationEntityModelTypeEnum.COMPANY
        );

        if (!company) {
            return;
        }

        const confirmed = await confirm({
            title: 'Заполнить опрос по результатам звонка?',
            message: `Будет открыта форма опроса компании "${getCompanyName(company.entity)}"`,
            okButton: 'Заполнить',
            cancelButton: 'Пропустить',
            onIcon: 'fa-solid fa-pen'
        });

        if (!confirmed) {
            return;
        }

        const contact = relations.find(
            relation => relation.entity_type === TaskRelationEntityModelTypeEnum.CONTACT
        );

        openSurvey(company.entity.id, { offer_contact_id: contact?.id });
    }

    return {
        suggestSurveyByTask
    };
});
