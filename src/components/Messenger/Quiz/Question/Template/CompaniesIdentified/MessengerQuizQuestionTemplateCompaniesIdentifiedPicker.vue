<template>
    <div v-if="isInitialized && isVisibility" class="messenger-quiz-form-offer-picker w-100">
        <Spinner v-if="isLoading" class="mini" center label="Поиск объектов.." />
        <template v-else-if="objects.length">
            <DashboardChip class="dashboard-bg-light mb-1">
                {{ pluralObjectsLabel }}
            </DashboardChip>
            <DashboardChip v-if="objects.length" class="dashboard-bg-warning-l mb-1">
                Укажите новых арендаторов на объектах, о которых стало известно.
            </DashboardChip>
            <div class="d-flex flex-column gap-1">
                <MessengerQuizQuestionTemplateCompaniesIdentifiedPickerObject
                    v-for="object in objects"
                    :key="object.id"
                    v-model="objectsModelValue[object.id].answer.description[textAnswerId]"
                    @show-preview="openPreview(object.photo ?? [])"
                    :object
                    :question
                />
            </div>
            <DashboardChip v-if="!objects.length" class="dashboard-bg-light" with-icon>
                <i class="fa-solid fa-ban"></i>
                <span>У компании нет занесенных объектов.</span>
            </DashboardChip>
        </template>
        <DashboardChip v-else class="dashboard-bg-light" with-icon>
            <i class="fa-solid fa-ban"></i>
            <span>У компании нет занесенных объектов.</span>
        </DashboardChip>
    </div>
</template>
<script setup>
import { computed, ref, shallowRef } from 'vue';
import api from '@/api/api.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import Spinner from '@/components/common/Spinner.vue';
import plural from 'plural-ru';
import { watchOnce } from '@vueuse/core';
import MessengerQuizQuestionTemplateCompaniesIdentifiedPickerObject from '@/components/Messenger/Quiz/Question/Template/CompaniesIdentified/MessengerQuizQuestionTemplateCompaniesIdentifiedPickerObject.vue';
import { getLinkFile } from '@/utils/url.js';
import { usePreviewer } from '@/composables/usePreviewer.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';

const emit = defineEmits(['set-as-disabled']);
const objectsModelValue = defineModel('objects');

const props = defineProps({
    disabled: Boolean,
    companyId: {
        type: Number,
        required: true
    },
    editMode: Boolean,
    passiveMode: Boolean,
    mainAnswer: Boolean,
    question: {
        type: Object,
        required: true
    }
});

const isLoading = ref(true);
const isInitialized = ref(false);

const objects = shallowRef([]);

const pluralObjectsLabel = computed(() => {
    return plural(
        objects.value.length,
        'Найден %d объект.',
        'Найдено %d объекта.',
        'Найдено %d объектов.'
    );
});

async function fetchObjects() {
    isLoading.value = true;

    const objectsResponse = await api.object.list({ company_id: props.companyId });

    if (objectsResponse?.data?.length) {
        objects.value = objectsResponse.data;
        initObjectsModelValue(objects.value);
    } else {
        emit('set-as-disabled');
    }

    isLoading.value = false;
}

const isVisibility = computed(() => props.mainAnswer);

watchOnce(
    () => props.mainAnswer,
    value => {
        if (isNotNullish(value)) {
            fetchObjects();
            isInitialized.value = true;
        }
    },
    { immediate: true }
);

// form

function setValue(value) {
    // selectedRequestsSet.value.clear();
    //
    // if (value.archived?.length) {
    //     modelValue.value.archived = [...value.archived];
    // } else {
    //     modelValue.value.archived = [];
    // }
    //
    // if (value.actual?.length) {
    //     value.actual.forEach(id => {
    //         selectRequest(id);
    //     });
    // }
}

defineExpose({ setValue });

// data

const textAnswerId = computed(() => props.question.answers['text-answer']?.[0]?.id);

function initObjectsModelValue(payload) {
    objectsModelValue.value = payload.reduce((acc, element) => {
        acc[element.id] = {
            id: element.id,
            answer: {
                description: props.question.answers['text-answer'].reduce((acc, el) => {
                    acc[el.id] = [];
                    return acc;
                }, {}),
                main: props.question.answers['yes-no'].reduce((acc, el) => {
                    acc[el.id] = true;
                    return acc;
                }, {})
            }
        };

        return acc;
    }, {});
}

// preview

// preview

const { preview } = usePreviewer();

function openPreview(photos) {
    preview(photos.map((photo, key) => ({ src: getLinkFile(photo), id: key })));
}
</script>
