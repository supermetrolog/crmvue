<template>
    <div class="survey-form-objects">
        <Splitpanes class="default-theme" vertical :maximize-panes="false">
            <Pane min-size="10" max-size="35" size="31">
                <Progress
                    v-if="formObjects.length"
                    title="Обработка предложений"
                    :percent="completedObjectProgress"
                    class="mb-1"
                />
                <div v-if="objects.length" class="survey-form-objects__list">
                    <SurveyFormObject
                        v-for="object in objects"
                        :key="object.id"
                        v-model="form.current[object.id]"
                        @select="selectObject(object)"
                        @show-map="showObjectOnMap(object)"
                        @show-preview="showObjectPreview(object)"
                        @object-destroyed="onObjectDestroyed(object)"
                        @object-sold="onObjectSold(object)"
                        :active="selectedObject?.id === object.id"
                        :object="object"
                        class="survey-form-objects__element"
                    />
                </div>
                <div v-else-if="hasNewObject">
                    <VueEditor
                        v-model="form.created"
                        label="Описание предложения"
                        placeholder="Опишите максимально характеристики объекта, условия предложения, цены и условие сотрудничества.."
                        :toolbar="false"
                        :min-height="100"
                    />
                    <UiButton
                        @click="deleteNewObject"
                        small
                        color="danger-light"
                        icon="fa-solid fa-trash"
                        class="mt-2"
                    >
                        Удалить
                    </UiButton>
                </div>
                <EmptyData v-else no-rounded class="h-100">
                    <p>У клиента нет объектов и предложений..</p>
                    <template #actions>
                        <UiButton
                            @click="newObjectFormIsVisible = true"
                            color="success-light"
                            icon="fa-solid fa-plus"
                        >
                            Добавить предложение
                        </UiButton>
                    </template>
                </EmptyData>
            </Pane>
            <Pane min-size="65" max-size="90" size="69">
                <SurveyFormObjectsPreview
                    v-if="selectedObject"
                    :key="selectedObject.id"
                    v-model="form.current[selectedObject.id]"
                    @show-preview="showObjectPreview(selectedObject, $event)"
                    :object="selectedObject"
                />
                <div
                    v-else
                    class="d-flex flex-column h-100 align-items-center justify-content-center"
                >
                    <UiField color="light">Выберите объект для просмотра предложений</UiField>
                </div>
            </Pane>
        </Splitpanes>
        <teleport to="body">
            <UiModal
                v-model:visible="newObjectFormIsVisible"
                :width="900"
                title="Новое предложение"
            >
                <UiForm>
                    <VueEditor
                        v-model="form.created"
                        label="Описание предложения"
                        placeholder="Опишите максимально характеристики объекта, условия предложения, цены и условие сотрудничества.."
                        :toolbar="false"
                        :min-height="150"
                    />
                </UiForm>
                <template #actions="{ close }">
                    <UiButton
                        @click="confirmNewObject"
                        color="success-light"
                        small
                        icon="fa-solid fa-check"
                    >
                        Сохранить
                    </UiButton>
                    <UiButton @click="close" color="light" small icon="fa-solid fa-ban">
                        Отмена
                    </UiButton>
                </template>
            </UiModal>
        </teleport>
    </div>
</template>
<script setup>
import SurveyFormObject from '@/components/SurveyForm/Object/SurveyFormObject.vue';
import { computed, ref, shallowRef, watch } from 'vue';
import { useMapPreviewer } from '@/composables/useMapPreviewer.js';
import { usePreviewer } from '@/composables/usePreviewer.js';
import { getLinkFile } from '@/utils/url.js';
import { TASK_FORM_STEPS, useTaskManager } from '@/composables/useTaskManager.js';
import api from '@/api/api.js';
import { messenger } from '@/const/messenger.js';
import { useNotify } from '@/utils/use/useNotify.js';
import { getCompanyShortName } from '@/utils/formatters/models/company.js';
import { Pane, Splitpanes } from 'splitpanes';
import SurveyFormObjectsPreview from '@/components/SurveyForm/ObjectsPreview/SurveyFormObjectsPreview.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiField from '@/components/common/UI/UiField.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import Progress from '@/components/common/Progress.vue';

const props = defineProps({
    objects: {
        type: Array,
        required: true
    },
    company: {
        type: Object,
        required: true
    }
});

const form = defineModel({ type: Object });

function generateForm() {
    if (!('current' in form.value)) {
        form.value.current = {};
    }

    if (!('created' in form.value)) {
        form.value.created = null;
    }

    for (const object of props.objects) {
        if (!(object.id in form.value.current)) {
            form.value.current[object.id] = {
                answer: null
            };
        }
    }
}

watch(() => props.objects.length, generateForm, { immediate: true });

const formObjects = computed(() => Object.values(form.value.current));

const completedObjectProgress = computed(() => {
    return (
        (formObjects.value.reduce(
            (acc, object) => (isNotNullish(object.answer) ? acc + 1 : acc),
            0
        ) /
            formObjects.value.length) *
        100
    );
});

// previews

const { previewInMap } = useMapPreviewer();
const { preview } = usePreviewer();

function showObjectOnMap(object) {
    previewInMap({
        objectId: object.id
    });
}

function showObjectPreview(object, key) {
    preview(
        object.photo.map((photo, key) => ({ src: getLinkFile(photo), id: key })),
        key
    );
}

// select

const selectedObject = shallowRef(null);

function selectObject(object) {
    if (selectedObject.value === object) {
        selectedObject.value = null;
    } else {
        selectedObject.value = object;
    }
}

// tasks

const { createTaskWithTemplate } = useTaskManager();
const notify = useNotify();

async function createObjectMessageWithTask(object, messagePayload, taskPayload) {
    const targetChatMemberId = await api.messenger.getChatMemberIdByQuery({
        model_type: messenger.dialogTypes.OBJECT,
        object_id: object.id
    });

    if (targetChatMemberId) {
        try {
            await api.messenger.sendMessageWithTask(
                targetChatMemberId,
                messagePayload,
                taskPayload
            );

            notify.success('Сообщение и задача успешно созданы');
        } catch (error) {
            // TODO: Log sentry
            notify.error('Произошла ошибка. Попробуйте еще раз..');
        }
    } else {
        notify.warning('Объект не найден в чате. Создайте задачи вручную.');
    }
}

async function onObjectDestroyed(object) {
    const companyName = getCompanyShortName(props.company);

    const taskPayload = await createTaskWithTemplate({
        title: `Объект #${object.id} (комп. ${companyName}) снесен, отправить в пассив`,
        step: TASK_FORM_STEPS.MESSAGE
    });

    if (!taskPayload) return;

    const messagePayload = {
        message: `<b>Объект снесен!</b>`,
        template: 'object-destroyed'
    };

    await createObjectMessageWithTask(object, messagePayload, taskPayload);
}

async function onObjectSold(object) {
    const companyName = getCompanyShortName(props.company);

    const taskPayload = await createTaskWithTemplate({
        title: `Объект #${object.id} (комп. ${companyName}) продан`,
        step: TASK_FORM_STEPS.MESSAGE
    });

    if (!taskPayload) return;

    const messagePayload = {
        message: `<b>Объект продан!</b> Компания ${object.company_name} больше не владелец`,
        template: 'object-sold'
    };

    await createObjectMessageWithTask(object, messagePayload, taskPayload);
}

// new objects

const hasNewObject = ref(isNotNullish(form.value?.created));
const newObjectFormIsVisible = ref(false);

function confirmNewObject() {
    hasNewObject.value = true;
    newObjectFormIsVisible.value = false;
}

function deleteNewObject() {
    hasNewObject.value = false;
    form.value.created = null;
}
</script>
