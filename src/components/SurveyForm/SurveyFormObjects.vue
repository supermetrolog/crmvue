<template>
    <div class="survey-form-objects p-2">
        <Splitpanes class="default-theme" vertical :maximize-panes="false">
            <Pane min-size="10" max-size="35" size="31">
                <div class="d-flex flex-column">
                    <div class="d-flex gap-1 pr-2 mb-1 align-items-center">
                        <span class="font-weight-bold fs-3">Строения ({{ objects.length }})</span>
                        <span
                            @click="newObjectFormIsVisible = true"
                            class="ml-1 survey-form-objects__link"
                        >
                            + Добавить
                        </span>
                        <UiDropdownActions v-if="objects.length" class="ml-auto">
                            <template #trigger>
                                <UiButton
                                    :color="hasCheckedObject ? 'success-light' : 'light'"
                                    class="py-0 px-1 op-7"
                                    mini
                                >
                                    <div class="d-flex align-items-center">
                                        <span class="fs-2 d-flex gap-1">
                                            <span>Отметить выбранные</span>
                                            <span v-if="hasCheckedObject">
                                                ({{ checkedObjects.size }})
                                            </span>
                                            <span>как</span>
                                        </span>
                                        <i class="fa-solid fa-ellipsis-h ml-2 fs-3" />
                                    </div>
                                </UiButton>
                            </template>
                            <template #menu>
                                <UiDropdownActionsButton
                                    @handle="markChecked(1)"
                                    :disabled="!hasCheckedObject"
                                    icon="fa-solid fa-thumbs-up"
                                    label="Актуально без изменений"
                                />
                                <UiDropdownActionsButton
                                    @handle="markChecked(2)"
                                    :disabled="!hasCheckedObject"
                                    icon="fa-solid fa-thumbs-down"
                                    label="Больше не актуально"
                                />
                                <UiDropdownActionsButton
                                    @handle="markChecked(3)"
                                    :disabled="!hasCheckedObject"
                                    icon="fa-solid fa-phone-slash"
                                    label="Не опросил"
                                />
                            </template>
                        </UiDropdownActions>
                    </div>
                    <div
                        v-if="objects.length > 1"
                        class="d-flex align-items-center justify-content-between mb-1"
                    >
                        <UiCheckbox
                            @change="toggleAllObjectsChecked"
                            :checked="allObjectsToggled"
                            label="Выбрать все"
                            class="survey-form-objects__checkbox"
                        />
                    </div>
                    <div v-if="hasNewObject" class="pr-2">
                        <hr class="my-2" />
                        <VueEditor
                            v-model="form.created"
                            label="Описание новое строения"
                            placeholder="Опишите максимально характеристики объекта..."
                            :toolbar="false"
                            :min-height="50"
                            :max-height="200"
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
                        <hr class="my-2" />
                    </div>
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
                            @create-task="createTask(object)"
                            @toggle-checked="toggleCheckedObject(object, $event)"
                            :active="selectedObject?.id === object.id"
                            :object="object"
                            :checked="checkedObjects.has(object.id)"
                            editable
                            class="survey-form-objects__element"
                        />
                    </div>
                    <EmptyData v-else-if="!hasNewObject" no-rounded class="h-100">
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
                </div>
            </Pane>
            <Pane min-size="65" max-size="90" size="69">
                <SurveyFormObjectsPreview
                    v-if="selectedObject"
                    :key="selectedObject.id"
                    v-model="form.current[selectedObject.id]"
                    @show-preview="showObjectPreview(selectedObject, $event)"
                    :object="selectedObject"
                    :company
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
import dayjs from 'dayjs';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import UiCheckbox from '@/components/common/Forms/UiCheckbox.vue';

const props = defineProps({
    objects: {
        type: Array,
        required: true
    },
    company: {
        type: Object,
        required: true
    },
    survey: Object
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

// TODO: Добавить progress

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

function getTaskRelationsByObject(object) {
    return [
        { entity_type: 'company', entity_id: props.company.id },
        { entity_type: 'survey', entity_id: props.survey.id },
        { entity_type: 'c_industry', entity_id: object.id }
    ];
}

async function onObjectDestroyed(object) {
    const companyName = getCompanyShortName(props.company);

    const taskPayload = await createTaskWithTemplate({
        title: `Объект #${object.id} (комп. ${companyName}) снесен, отправить в пассив`,
        step: TASK_FORM_STEPS.MESSAGE,
        start: new Date(),
        end: dayjs().add(7, 'day').toDate(),
        relations: getTaskRelationsByObject(object)
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
        step: TASK_FORM_STEPS.MESSAGE,
        start: new Date(),
        end: dayjs().add(7, 'day').toDate(),
        relations: getTaskRelationsByObject(object)
    });

    if (!taskPayload) return;

    const messagePayload = {
        message: `<b>Объект продан!</b> Компания ${object.company_name} больше не владелец`,
        template: 'object-sold'
    };

    await createObjectMessageWithTask(object, messagePayload, taskPayload);
}

const taskIsCreating = ref(false);

async function createTask(object) {
    const companyName = getCompanyShortName(props.company);

    const taskPayload = await createTaskWithTemplate({
        title: `Объект #${object.id} (комп. ${companyName}) `,
        start: new Date(),
        end: dayjs().add(7, 'day').toDate(),
        relations: getTaskRelationsByObject(object)
    });

    if (!taskPayload) return;

    taskIsCreating.value = true;

    try {
        await api.task.create(taskPayload);
        notify.success('Задача успешно создана!');
    } finally {
        taskIsCreating.value = false;
    }
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

// select functions

const checkedObjects = ref(new Set());

function toggleCheckedObject(object, value) {
    if (value && !checkedObjects.value.has(object.id)) {
        checkedObjects.value.add(object.id);

        allObjectsToggled.value = checkedObjects.value.size === props.objects.length;
    } else if (!value && checkedObjects.value.has(object.id)) {
        checkedObjects.value.delete(object.id);

        allObjectsToggled.value = false;
    }
}

const allObjectsToggled = ref(false);

function toggleAllObjectsChecked() {
    if (allObjectsToggled.value) {
        checkedObjects.value.clear();
        allObjectsToggled.value = false;
    } else {
        checkedObjects.value = new Set(props.objects.map(object => object.id));
        allObjectsToggled.value = true;
    }
}

const hasCheckedObject = computed(() => !!checkedObjects.value.size);

function markChecked(value) {
    for (const objectId of checkedObjects.value) {
        form.value.current[objectId].answer = value;
    }

    checkedObjects.value.clear();
    allObjectsToggled.value = false;

    notify.success('Выбранные объекты успешно обработаны');
}
</script>
