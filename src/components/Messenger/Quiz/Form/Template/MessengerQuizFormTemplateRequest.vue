<template>
    <div class="messenger-quiz-form-template-request">
        <div class="messenger-quiz-form-template-request__row">
            <MessengerQuizFormTemplateRequestPreview
                :request
                :class="{ disabled: isDisabled }"
                class="messenger-quiz-form-template-request__preview"
            />
            <div class="messenger-quiz-form-template-request__aside">
                <div class="d-flex gap-1">
                    <MessengerQuizFormRadioChip
                        v-model="mainAnswer"
                        :disabled
                        :value="true"
                        unselect
                        label="Да"
                    />
                    <MessengerQuizFormRadioChip
                        v-model="mainAnswer"
                        :disabled
                        :value="false"
                        unselect
                        label="Нет"
                    />
                    <MessengerQuizFormRadioChip
                        v-model="hasNullMainAnswer"
                        :value="true"
                        :disabled
                        unselect
                        class="flex-grow-1 messenger-quiz-question__no-answer"
                        label="Не ответил"
                    />
                </div>
                <AnimationTransition :speed="0.3">
                    <div v-if="hasAnswer" class="d-flex gap-1">
                        <MessengerQuizFormRadioChip
                            v-model="actionAnswer"
                            :value="1"
                            unselect
                            label="Редактировать"
                        />
                        <MessengerQuizFormRadioChip
                            v-model="actionAnswer"
                            :value="2"
                            unselect
                            :disabled="mainAnswer"
                            label="В пассив"
                        />
                    </div>
                </AnimationTransition>
            </div>
        </div>
        <AnimationTransition :speed="0.3">
            <Textarea
                v-if="actionAnswer"
                v-model="description"
                auto-height
                :min-height="50"
                :max-height="100"
                placeholder="Комментарии.."
            />
        </AnimationTransition>
    </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import MessengerQuizFormTemplateRequestPreview from '@/components/Messenger/Quiz/Form/Template/MessengerQuizFormTemplateRequestPreview.vue';
import MessengerQuizFormRadioChip from '@/components/Messenger/Quiz/Form/MessengerQuizFormRadioChip.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import { locationOptions } from '@/const/options/location.options.js';
import { toNumberOrRangeFormat } from '@/utils/formatters/number.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';

const props = defineProps({
    request: {
        type: Object,
        required: true
    },
    disabled: Boolean
});

// form

const mainAnswer = ref(undefined);
const hasNullMainAnswer = ref(false);
const description = ref(null);

const hasAnswer = computed(() => isNotNullish(mainAnswer.value));

watch(hasNullMainAnswer, value => {
    if (value) mainAnswer.value = null;
});

watch(mainAnswer, (value, oldValue) => {
    if (isNotNullish(value)) hasNullMainAnswer.value = false;

    if (isNotNullish(oldValue)) {
        description.value = null;
        actionAnswer.value = null;
    }
});

const actionAnswer = ref(null);

const isDisabled = computed(() => hasNullMainAnswer.value || mainAnswer.value === false);

function generateLocation() {
    const locations = [];

    if (props.request.regions) {
        locations.push(
            props.request.regions.map(element => locationOptions.region[element.region]).join(', ')
        );
    }

    if (props.request.directions) {
        locations.push(
            ...props.request.directions.map(
                element => locationOptions.directionWithShort[element.direction].full
            )
        );
    }

    if (props.request.districts) {
        locations.push(
            ...props.request.districts.map(element => locationOptions.district[element.district])
        );
    }

    return locations.join(', ').slice(0, 48) + '...';
}

function generateCalcArea() {
    return toNumberOrRangeFormat(props.request.minArea, props.request.maxArea);
}

function getForm() {
    return {
        id: props.request.id,
        answer: mainAnswer.value,
        action: hasAnswer.value ? actionAnswer.value : null,
        description: hasAnswer.value ? description.value : null,
        location: generateLocation(),
        deal_type: props.request.dealType,
        calc_area: generateCalcArea()
    };
}

function validate() {
    if (props.disabled) return true;

    if (isNotNullish(mainAnswer.value)) {
        if (!mainAnswer.value) return isNotNullish(actionAnswer.value);

        return true;
    }

    return hasNullMainAnswer.value;
}

function setAnswer(value) {
    hasNullMainAnswer.value = value === null;
    mainAnswer.value = value;
}

function setForm(form) {
    hasNullMainAnswer.value = isNullish(form.answer);
    mainAnswer.value = form.answer;

    actionAnswer.value = form.action;
    description.value = form.description;
}

defineExpose({ getForm, validate, setAnswer, setForm });
</script>
