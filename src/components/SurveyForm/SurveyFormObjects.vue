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
                                    label="Без изменений"
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
                    <div
                        v-if="objects.length || createdObjects.length"
                        class="survey-form-objects__list"
                    >
                        <SurveyFormNewObject
                            v-for="(object, key) in createdObjects"
                            :key="object.id"
                            @select="selectNewObject(object)"
                            @edit="editNewObjectByKey(key)"
                            @delete="deleteNewObjectByKey(key)"
                            :active="selectedNewObject === object"
                            :object="object"
                            editable
                            class="survey-form-objects__element"
                        />
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
                    <EmptyData v-else-if="createdObjects.length === 0" no-rounded class="h-100">
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
                    :survey
                />
                <div v-else-if="selectedNewObject" class="pl-2">
                    <p class="form__subtitle">Тип объекта</p>
                    <div class="d-flex gap-1 mt-1">
                        <RadioChip
                            v-model="selectedNewObject.is_land"
                            label="Строение"
                            :value="0"
                        />
                        <RadioChip v-model="selectedNewObject.is_land" label="Участок" :value="1" />
                    </div>
                    <div class="d-flex gap-1 mt-2">
                        <UiInput
                            v-model="selectedNewObject.area"
                            label="Площадь"
                            unit="м<sup>2"
                            class="w-50 position-relative"
                            required
                        />
                        <MultiSelect
                            v-model="selectedNewObject.class"
                            :disabled="selectedNewObject.is_land"
                            label="Класс объекта"
                            class="w-50"
                            :options="objectOptions.class"
                        />
                    </div>
                    <UiTextarea
                        v-model="selectedNewObject.address"
                        label="Адрес"
                        class="w-100 mt-2"
                        auto-height
                        :min-height="50"
                        :max-height="150"
                        required
                    />
                    <VueEditor
                        v-model="selectedNewObject.description"
                        label="Опишите параметры, характеристики и имеющиеся предложения"
                        class="mt-2 w-100"
                        :toolbar="false"
                        :min-height="80"
                        :debounce="200"
                        required
                    />
                </div>
                <div
                    v-else
                    class="d-flex flex-column h-100 align-items-center justify-content-center"
                >
                    <UiField color="light">Выберите объект для просмотра предложений</UiField>
                </div>
            </Pane>
        </Splitpanes>
        <teleport to="body">
            <SurveyFormNewObjectForm
                v-if="newObjectFormIsVisible"
                @close="closeNewObjectForm"
                @created="addNewObject"
                @updated="updateNewObject"
                :form-data="editedNewObject"
            />
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
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import dayjs from 'dayjs';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import UiCheckbox from '@/components/common/Forms/UiCheckbox.vue';
import { isNullish } from '@/utils/helpers/common/isNullish.ts';
import { isArray } from '@/utils/helpers/array/isArray.ts';
import { isString } from '@/utils/helpers/string/isString.js';
import SurveyFormNewObject from '@/components/SurveyForm/Object/SurveyFormNewObject.vue';
import SurveyFormNewObjectForm from '@/components/SurveyForm/Object/SurveyFormNewObjectForm.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';
import { objectOptions } from '@/const/options/object.options.js';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';

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
        form.value.created = [];
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

    selectedNewObject.value = null;
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

const newObjectFormIsVisible = ref(false);

const createdObjects = computed(() => {
    if (isNullish(form.value.created)) return [];
    if (isArray(form.value.created)) return form.value.created;
    if (isString(form.value.created)) return { description: form.value.created };
    return [];
});

function addNewObject(payload) {
    if (isArray(form.value.created)) {
        form.value.created.push(payload);
    } else {
        form.value.created = [payload];
    }

    newObjectFormIsVisible.value = false;
}

function updateNewObject(payload) {
    Object.assign(editedNewObject.value, payload);
    editedNewObject.value = false;

    newObjectFormIsVisible.value = false;
}

function closeNewObjectForm() {
    newObjectFormIsVisible.value = false;
    editedNewObject.value = null;
}

const editedNewObject = shallowRef(null);

function editNewObjectByKey(key) {
    editedNewObject.value = form.value.created[key];
    newObjectFormIsVisible.value = true;
}

function deleteNewObjectByKey(key) {
    form.value.created.splice(key, 1);
}

const selectedNewObject = ref(null);

function selectNewObject(object) {
    selectedNewObject.value = object;
    selectedObject.value = null;
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
