<template>
    <div class="survey-form-objects">
        <Splitpanes v-if="hasData" class="default-theme" vertical :maximize-panes="false">
            <Pane min-size="10" max-size="35" size="31">
                <div class="d-flex gap-1 pr-2 mb-1 align-items-center">
                    <span class="font-weight-bold fs-3">Строения ({{ objects.length }})</span>
                </div>
                <Loader v-if="objectsIsLoading" label="Загрузка объектов.." />
                <div
                    v-else-if="objects.length || createdObjects.length"
                    class="survey-form-objects__list"
                >
                    <SurveyFormNewObject
                        v-for="object in createdObjects"
                        :key="object.id"
                        @select="selectNewObject(object)"
                        :active="selectedNewObject === object"
                        :object="object"
                        class="survey-form-objects__element"
                    />
                    <SurveyFormObject
                        v-for="object in objects"
                        :key="object.id"
                        @select="selectObject(object)"
                        @show-map="showObjectOnMap(object)"
                        @show-preview="showObjectPreview(object)"
                        :model-value="prepared[object.id]"
                        :active="selectedObject?.id === object.id"
                        :object="object"
                        class="survey-form-objects__element"
                    />
                </div>
            </Pane>
            <Pane min-size="65" max-size="90" size="69">
                <SurveyCardAdvancedObjectsPreview
                    v-if="selectedObject"
                    :key="selectedObject.id"
                    @show-preview="showObjectPreview(selectedObject, $event)"
                    :answer="prepared[selectedObject.id]"
                    :object="selectedObject"
                    read-only
                />
                <div v-else-if="selectedNewObject" class="pl-2">
                    <p class="form__subtitle">Тип объекта</p>
                    <div class="d-flex gap-1 mt-1">
                        <RadioChip
                            v-model="selectedNewObject.is_land"
                            label="Строение"
                            :value="0"
                            disabled
                        />
                        <RadioChip
                            v-model="selectedNewObject.is_land"
                            label="Участок"
                            :value="1"
                            disabled
                        />
                    </div>
                    <div class="d-flex gap-1 mt-2">
                        <UiInput
                            v-model="selectedNewObject.area"
                            label="Площадь"
                            unit="м<sup>2"
                            class="w-50 position-relative"
                            disabled
                        />
                        <MultiSelect
                            v-model="selectedNewObject.class"
                            disabled
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
                        disabled
                    />
                    <VueEditor
                        v-model="selectedNewObject.description"
                        label="Опишите параметры, характеристики и имеющиеся предложения"
                        class="mt-2 w-100"
                        :toolbar="false"
                        :min-height="80"
                        :debounce="200"
                        disabled
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
        <EmptyData v-else no-rounded>Список предложений пуст..</EmptyData>
    </div>
</template>
<script setup>
import SurveyFormObject from '@/components/SurveyForm/Object/SurveyFormObject.vue';
import { computed, onBeforeMount, ref, shallowRef } from 'vue';
import { useMapPreviewer } from '@/composables/useMapPreviewer.js';
import { usePreviewer } from '@/composables/usePreviewer.js';
import { getLinkFile } from '@/utils/url.js';
import api from '@/api/api.js';
import { Pane, Splitpanes } from 'splitpanes';
import UiField from '@/components/common/UI/UiField.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import Loader from '@/components/common/Loader.vue';
import SurveyCardAdvancedObjectsPreview from '@/components/SurveyCard/SurveyCardAdvancedObjectsPreview.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import SurveyFormNewObject from '@/components/SurveyForm/Object/SurveyFormNewObject.vue';
import { isNullish } from '@/utils/helpers/common/isNullish.ts';
import { isArray } from '@/utils/helpers/array/isArray.ts';
import { isString } from '@/utils/helpers/string/isString.js';
import { objectOptions } from '@/const/options/object.options.js';
import UiInput from '@/components/common/Forms/UiInput.vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';

const props = defineProps({
    prepared: {
        type: Object,
        required: true
    },
    created: [Array, Object, String],
    company: Object
});

const hasData = computed(() => {
    return isNotNullish(props.created) || Object.keys(props.prepared).length > 0;
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

const selectedNewObject = ref(null);

function selectNewObject(object) {
    selectedNewObject.value = object;
    selectedObject.value = null;
}

// objects

const objects = shallowRef([]);
const objectsIsLoading = ref(false);

async function fetchObjects() {
    objectsIsLoading.value = true;

    const response = await api.object.list({
        company_id: props.company.id,
        'per-page': 0,
        expand: 'commercialOffers.blocks,offerMix.offer'
    });

    objects.value = response.data;
    objectsIsLoading.value = false;
}

onBeforeMount(fetchObjects);

const createdObjects = computed(() => {
    if (isNullish(props.created)) return [];
    if (isArray(props.created)) return props.created;
    if (isString(props.created)) return { description: props.created };
    return [];
});
</script>
