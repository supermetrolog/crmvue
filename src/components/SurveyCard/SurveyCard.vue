<template>
    <div class="messenger-quiz-preview survey-card survey-form__wrapper">
        <AnimationTransition :speed="0.3">
            <Spinner v-if="isLoading" label="Загрузка результатов.." class="absolute-center" />
            <template v-else-if="targetSurvey">
                <SurveyComponent
                    @hide="$emit('hide')"
                    @edit="$emit('edit', targetSurvey)"
                    :survey="targetSurvey"
                />
            </template>
        </AnimationTransition>
    </div>
</template>
<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import Spinner from '@/components/common/Spinner.vue';
import api from '@/api/api.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import SurveyCardBasic from '@/components/SurveyCard/SurveyCardBasic.vue';
import SurveyCardAdvanced from '@/components/SurveyCard/SurveyCardAdvanced.vue';

defineEmits(['hide', 'edit']);
const props = defineProps({
    surveyId: Number,
    survey: Object
});

const isLoading = ref(isNullish(props.survey));

const localSurvey = ref(null);

const targetSurvey = computed(() => {
    return props.survey ?? localSurvey.value;
});

const surveyComponentsByType = {
    advanced: SurveyCardAdvanced,
    basic: SurveyCardBasic
};

const SurveyComponent = computed(() => surveyComponentsByType[targetSurvey.value.type]);

async function fetchSurvey() {
    isLoading.value = true;

    localSurvey.value = await api.survey.get(props.surveyId);

    isLoading.value = false;
}

onMounted(() => {
    if (isNullish(props.survey) && isNotNullish(props.surveyId)) fetchSurvey();
});

watch(
    () => props.surveyId,
    value => {
        if (isNotNullish(value)) {
            fetchSurvey();
        }
    }
);
</script>
