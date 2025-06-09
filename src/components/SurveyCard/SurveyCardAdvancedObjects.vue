<template>
    <div class="survey-form-objects">
        <Splitpanes v-if="hasData" class="default-theme" vertical :maximize-panes="false">
            <Pane min-size="10" max-size="35" size="31">
                <div class="d-flex gap-1 pr-2 mb-1 align-items-center">
                    <span class="font-weight-bold fs-3">Строения ({{ objects.length }})</span>
                </div>
                <Loader v-if="objectsIsLoading" label="Загрузка объектов.." />
                <div v-if="created">
                    <VueEditor
                        :model-value="created"
                        label="Описание предложения"
                        placeholder="Опишите максимально характеристики объекта, условия предложения, цены и условие сотрудничества.."
                        :toolbar="false"
                        disabled
                        :min-height="100"
                    />
                </div>
                <div v-else class="survey-form-objects__list">
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

const props = defineProps({
    prepared: {
        type: Object,
        required: true
    },
    created: String,
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
</script>
