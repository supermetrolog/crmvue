<template>
    <div class="task-card-process-request">
        <div class="d-flex flex-wrap gap-1">
            <UiButton
                v-if="survey"
                @click="$emit('show-survey', survey.entity_id)"
                small
                color="white"
                icon="fa-solid  fa-square-poll-horizontal"
                data-tour-id="task-process:show-survey"
            >
                Опрос #{{ survey.entity_id }}
            </UiButton>
            <TaskCardProcessEntityCompany
                v-for="company in companies"
                :key="company.id"
                @edit="editCompany(company.entity)"
                @enable="enableCompany(company.entity)"
                @disable="disableCompany(company.entity)"
                @change-consultant="changeCompanyConsultant(company.entity)"
                :company="company.entity"
                data-tour-id="task-process:show-companies"
            />
            <slot name="list" />
        </div>
        <slot name="modals" />
        <FormCompany
            v-if="companyFormIsVisible"
            @close="companyFormIsVisible = false"
            @updated="onUpdatedCompany"
            :form-data="editedCompany"
        />
        <FormCompanyDisable
            v-if="disableFormIsVisible"
            @close="closeDisableForm"
            @disabled="onDisabledCompany"
            :company="disablingCompany"
        />
        <FormModalCompanyChangeConsultant
            v-if="changeCompanyConsultantModalIsVisible"
            @close="closeCompanyConsultantModal"
            @changed="onCompanyConsultantChanged"
            :company="changedCompany"
            :pinned-task="task"
        />
    </div>
</template>

<script setup lang="ts">
import { TaskRelationEntity, TaskRelationEntityModelTypeEnum, TaskView } from '@/types/task';
import { computed, ref, shallowRef } from 'vue';
import api from '@/api/api';
import { useNotify } from '@/utils/use/useNotify';
import UiButton from '@/components/common/UI/UiButton.vue';
import TaskCardProcessEntityCompany from '@/components/TaskCard/Process/TaskCardProcessEntityCompany.vue';
import FormCompany from '@/components/Forms/Company/FormCompany.vue';
import { useCompanyDisable } from '@/components/Company/useCompanyDisable';
import FormCompanyDisable from '@/components/Forms/Company/FormCompanyDisable.vue';
import FormModalCompanyChangeConsultant from '@/components/Forms/Company/FormModalCompanyChangeConsultant.vue';

defineEmits<{ (e: 'show-survey', surveyId: number): void }>();

const props = defineProps<{
    task: TaskView;
    relations: TaskRelationEntity[];
}>();

const companies = computed(() =>
    props.relations.filter(
        relation => relation.entity_type === TaskRelationEntityModelTypeEnum.COMPANY
    )
);

const survey = computed(() =>
    props.relations.find(
        relation => relation.entity_type === TaskRelationEntityModelTypeEnum.SURVEY
    )
);

// company

const companyFormIsVisible = ref(false);
const editedCompany = ref(null);

async function editCompany(company) {
    company.loading = true;
    editedCompany.value = await api.companies.getCompany(company.id);
    company.loading = false;

    companyFormIsVisible.value = true;
}

function onUpdatedCompany(company) {
    const companyIndex = companies.value.findIndex(r => r.entity_id === company.id);
    if (companyIndex !== -1) {
        Object.assign(companies.value[companyIndex].entity, company);
    }

    editedCompany.value = null;
    companyFormIsVisible.value = false;
}

const {
    disableCompany,
    disableFormIsVisible,
    enableCompany,
    disablingCompany,
    onDisabledCompany,
    closeDisableForm
} = useCompanyDisable();

// change consultant

const changeCompanyConsultantModalIsVisible = ref(false);
const changedCompany = shallowRef(null);

function closeCompanyConsultantModal() {
    changeCompanyConsultantModalIsVisible.value = false;
    changedCompany.value = null;
}

function changeCompanyConsultant(company) {
    changedCompany.value = company;
    changeCompanyConsultantModalIsVisible.value = true;
}

const notify = useNotify();

function onCompanyConsultantChanged() {
    changeCompanyConsultantModalIsVisible.value = false;
    changedCompany.value = null;
    notify.success('Консультант компании успешно изменен');
}
</script>
