<template>
    <div class="survey-form-objects">
        <div class="survey-form-object-preview">
            <div>
                <div class="survey-form-object-preview__tabs">
                    <SurveyFormObjectsPreviewTab v-model="currenTab" :name="TABS.ACTIVE">
                        <i class="fa-solid fa-up-long mr-1" />
                        <span>Актив ({{ requestsCount }})</span>
                    </SurveyFormObjectsPreviewTab>
                </div>
                <div class="survey-form-object-preview__content">
                    <div v-if="currenTab === TABS.ACTIVE">
                        <div v-if="hasData" class="survey-form-object-preview__list">
                            <SurveyFormRequestsPreviewNewRequest
                                v-for="request in created"
                                :key="request.id"
                                :model-value="request.description"
                                :request="request"
                            />
                            <hr v-if="created?.length" class="w-100" />
                            <SurveyCardAdvancedRequestsItem
                                v-for="request in prepared"
                                :key="request.id"
                                :request="request"
                            />
                        </div>
                        <EmptyData v-else class="mt-2">Список запросов пуст..</EmptyData>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, ref } from 'vue';
import SurveyFormObjectsPreviewTab from '@/components/SurveyForm/ObjectsPreview/SurveyFormObjectsPreviewTab.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import SurveyFormRequestsPreviewNewRequest from '@/components/SurveyForm/RequestsPreview/SurveyFormRequestsPreviewNewRequest.vue';
import SurveyCardAdvancedRequestsItem from '@/components/SurveyCard/SurveyCardAdvancedRequestsItem.vue';

const props = defineProps({
    prepared: {
        type: Object,
        required: true
    },
    created: {
        type: Array,
        default: () => []
    }
});

const hasData = computed(() => {
    return props.created?.length || Object.keys(props.prepared).length > 0;
});

const requestsCount = computed(() => Object.keys(props.prepared).length);

// tabs

const TABS = {
    ACTIVE: 'active'
};

const currenTab = ref(TABS.ACTIVE);
</script>
