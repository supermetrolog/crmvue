<template>
    <div class="container-fluid">
        <Teleport to="body">
            <FormField
                v-if="fieldFormIsVisible"
                @close="closeFieldForm"
                @updated="onFieldUpdated"
                @created="onFieldCreated"
                @deleted="fetchFields"
                :form-data="editingField"
            />
            <FormEffect
                v-if="effectsFormIsVisible"
                @close="closeEffectsForm"
                @updated="onEffectUpdated"
                @created="onEffectCreated"
                @deleted="onEffectDeleted"
                :form-data="editingEffect"
            />
        </Teleport>
        <div class="row">
            <div class="col-12">
                <SettingsSurveyEditablePreview />
            </div>
            <div class="col-12">
                <DashboardCard>
                    <template #header>
                        <SettingsFormHeader
                            @add="fieldFormIsVisible = true"
                            @load="loadFields"
                            @refresh="fetchFields"
                            title="Управления полями"
                            :size="fields.length"
                            :pagination="fieldsPagination"
                        />
                    </template>
                    <DashboardChip class="mb-2 dashboard-bg-warning-l mw-100">
                        <i class="fa-solid fa-exclamation-triangle" />
                        <span>
                            Пожалуйста, будьте аккуратны. Данные модели следует изменять и добавлять
                            только для новых обновлений. Неправильное изменение может вызвать ошибку
                            мессенджера.
                        </span>
                    </DashboardChip>
                    <div class="d-flex flex-wrap gap-2 mb-2">
                        <Loader v-if="fieldsIsLoading" small />
                        <SettingsFormRowElement
                            v-for="field in fields"
                            :key="field.id"
                            @delete="deleteField(field)"
                            @edit="editField(field)"
                            :element="field"
                            :is-deleted="field.deleted_at !== null"
                            can-edit
                        >
                            <template #text="{ item }">
                                <span class="mr-1">#{{ item.id }}</span>
                                <span>{{ item.field_type }}({{ item.type }})</span>
                            </template>
                        </SettingsFormRowElement>
                    </div>
                </DashboardCard>
            </div>
            <div class="col-12">
                <DashboardCard>
                    <template #header>
                        <SettingsFormHeader
                            @add="effectsFormIsVisible = true"
                            @load="loadEffects"
                            @refresh="fetchEffects"
                            title="Управление эффектами"
                            :size="effects.length"
                            :pagination="effectsPagination"
                        />
                    </template>
                    <div class="d-flex flex-wrap gap-2 mb-2">
                        <Loader v-if="effectsIsLoading" small />
                        <SettingsFormRowElement
                            v-for="element in effects"
                            :key="element.id"
                            @delete="deleteEffect(element)"
                            @edit="editEffect(element)"
                            :element="element"
                            can-edit
                            :is-deleted="!element.active"
                        >
                            <template #text="{ item }">
                                <span class="mr-1">#{{ item.id }}</span>
                                <span>{{ item.title }} ({{ item.kind }})</span>
                            </template>
                        </SettingsFormRowElement>
                    </div>
                </DashboardCard>
            </div>
            <UiCol cols="12">
                <SettingsSurveyQuestions />
            </UiCol>
            <UiCol cols="12">
                <SettingsSurveyQuestionAnswers />
            </UiCol>
        </div>
    </div>
</template>

<script setup>
import FormField from '@/components/Forms/FormField.vue';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import { onMounted, ref, shallowRef } from 'vue';
import api from '@/api/api.js';
import { useConfirm } from '@/composables/useConfirm.js';
import { useNotify } from '@/utils/use/useNotify.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import SettingsFormHeader from '@/components/Settings/SettingsFormHeader.vue';
import Loader from '@/components/common/Loader.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import FormEffect from '@/components/Forms/FormEffect.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import SettingsSurveyQuestionAnswers from '@/components/Settings/Survey/SettingsSurveyQuestionAnswers.vue';
import SettingsSurveyQuestions from '@/components/Settings/Survey/SettingsSurveyQuestions.vue';
import SettingsFormRowElement from '@/components/Settings/SettingsFormRowElement.vue';
import SettingsSurveyEditablePreview from '@/components/Settings/Survey/SettingsSurveyEditablePreview.vue';

const { confirm } = useConfirm();
const notify = useNotify();

const fields = ref([]);
const { isLoading: fieldsIsLoading } = useDelayedLoader();
const fieldsPagination = ref(null);

const effects = ref([]);
const { isLoading: effectsIsLoading } = useDelayedLoader();
const effectsPagination = ref(null);

const fieldFormIsVisible = shallowRef(false);
const effectsFormIsVisible = shallowRef(false);

const editingField = shallowRef(null);
const editingEffect = shallowRef(null);

const closeFieldForm = () => {
    fieldFormIsVisible.value = false;
    editingField.value = null;
};

const closeEffectsForm = () => {
    effectsFormIsVisible.value = false;
    editingEffect.value = null;
};

const fetchFields = async (page = 1) => {
    fieldsIsLoading.value = true;

    const response = await api.field.list(page);
    if (response) {
        fields.value = response.data;
        fieldsPagination.value = response.pagination;
    }

    fieldsIsLoading.value = false;
};

const fetchEffects = async (page = 1) => {
    effectsIsLoading.value = true;

    const response = await api.effect.list({ page });
    if (response) {
        effects.value = response.data;
        effectsPagination.value = response.pagination;
    }

    effectsIsLoading.value = false;
};

const loadEffects = async () => {
    const response = await api.effect.list({ page: effectsPagination.value.currentPage + 1 });

    if (response) {
        effects.value.push(...response.data);
        effectsPagination.value = response.pagination;
    }
};

const onEffectUpdated = effect => {
    const element = effects.value.find(element => element.id === effect.id);
    if (element) Object.assign(element, effect);

    closeEffectsForm();
};

const onEffectCreated = () => {
    fetchEffects();
    closeEffectsForm();
};

const onEffectDeleted = () => {
    fetchEffects();
};

const deleteEffect = async effect => {
    const confirmed = await confirm(
        'Удалить эффект',
        `Вы действительно хотите удалить эффект "#${effect.id} ${effect.title} (${effect.kind})"?`
    );
    if (!confirmed) return;

    const deleted = await api.effect.delete(effect.id);
    if (deleted) {
        notify.success('Эффект успешно удалено.');
        await fetchEffects();
    }
};

const editEffect = effect => {
    editingEffect.value = effect;
    effectsFormIsVisible.value = true;
};

const loadFields = async () => {
    const response = await api.field.list(fieldsPagination.value.currentPage + 1);

    if (response) {
        fields.value.push(...response.data);
        fieldsPagination.value = response.pagination;
    }
};

const deleteField = async field => {
    const confirmed = await confirm(
        'Удалить поле',
        `Вы действительно хотите удалить Поле "#${field.id} ${field.field_type}(${field.type})"?`
    );
    if (!confirmed) return;

    const deleted = await api.field.delete(field.id);
    if (deleted) {
        notify.success('Field успешно удалено.');
        fetchFields();
    }
};

const editField = field => {
    editingField.value = field;
    fieldFormIsVisible.value = true;
};

const onFieldCreated = () => {
    closeFieldForm();
    fetchFields();
};

const onFieldUpdated = field => {
    const fieldElement = fields.value.find(element => element.id === field.id);
    if (fieldElement) Object.assign(fieldElement, field);

    closeFieldForm();
};

onMounted(() => {
    fetchFields();
    fetchEffects();
});
</script>
