<template>
    <MessengerQuizQuestionTemplateDefault
        ref="questionElement"
        :question
        :disabled
        :ignored-effects="ignoredEffects"
        class="messenger-quiz__question"
    >
        <template #before-additions="{ mainAnswer, hidden, toggleHidden }">
            <MessengerQuizFormCustomFreeArea
                v-model:condition="conditionModelValue"
                v-model:delete="deleteCurrentArea"
                @change-hidden="toggleHidden"
                :disabled="mainAnswer !== true"
                :hidden="hidden"
                class="mt-1"
            />
        </template>
        <template v-if="currentObject" #after-content="{ mainAnswer }">
            <MessengerQuizQuestionTemplateWantsToSellPicker
                v-model:offers="offersForm"
                v-model:objects="objectsForm"
                :main-answer="mainAnswer"
                :company-id="currentObject.company_id"
                :disabled="conditionModelValue === 0 || deleteCurrentArea || !withRelated"
                :edit-mode="conditionModelValue === 1"
                :passive-mode="mainAnswer === false"
                class="mt-2"
                :question
                :ignored-effects
                :with-related
            />
        </template>
    </MessengerQuizQuestionTemplateDefault>
</template>
<script setup>
import { computed, ref, useTemplateRef, watch } from 'vue';
import MessengerQuizQuestionTemplateDefault from '@/components/Messenger/Quiz/Question/Template/MessengerQuizQuestionTemplateDefault.vue';
import MessengerQuizFormCustomFreeArea from '@/components/Messenger/Quiz/Form/Custom/MessengerQuizFormCustomFreeArea.vue';
import { quizEffectKinds } from '@/const/quiz.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import { useNotify } from '@/utils/use/useNotify.js';
import MessengerQuizQuestionTemplateWantsToSellPicker from '@/components/Messenger/Quiz/Question/Template/WantsToSell/MessengerQuizQuestionTemplateWantsToSellPicker.vue';
import { useStore } from 'vuex';
import { isString } from '@/utils/helpers/string/isString.js';
import { isNotEmptyString } from '@/utils/helpers/string/isNotEmptyString.js';

const props = defineProps({
    canBeDisabled: {
        type: Boolean,
        default: true
    },
    disabled: Boolean,
    withRelated: Boolean,
    question: {
        type: Object,
        required: true
    }
});

const ignoredEffects = new Set([
    quizEffectKinds.COMPANY_WANTS_TO_SELL_MUST_BE_EDITED,
    quizEffectKinds.COMPANY_WANTS_TO_SELL_ALREADY_DESCRIBED,
    quizEffectKinds.COMPANY_WANTS_TO_SELL_MUST_BE_DELETED
]);

const conditionModelValue = ref(null);
const deleteCurrentArea = ref(false);

// form

const templateRef = useTemplateRef('questionElement');

function getForm() {
    const form = templateRef.value.getForm();

    const mainAnswer = form.find(answer => answer.type === 'main');

    if (mainAnswer) {
        if (mainAnswer.value === true) {
            injectConditionAnswerToForm(form);
        } else {
            cancelConditionAnswerInForm(form);
        }

        if (mainAnswer.value === false) {
            const answer = form.find(answer =>
                answer.effects.has(quizEffectKinds.COMPANY_WANTS_TO_SELL_MUST_BE_DELETED)
            );

            if (answer) {
                answer.form = {
                    offers: Object.values(offersForm.value)
                };
            }
        }
    }

    return form;
}

const notify = useNotify();

function validate() {
    const isValid = templateRef.value.validate();
    if (!isValid) return false;

    const mainAnswer = templateRef.value.getMainAnswer();

    if (mainAnswer === true && isNullish(conditionModelValue.value)) {
        notify.info('Укажите, необходимо ли добавить/редактировать площади под продажу..');
        return false;
    }

    return true;
}

function setForm(form) {
    if (form.main?.value && form.tab?.length) {
        const mustBeEditedAnswer = form.tab.find(answer =>
            answer.effects.has(quizEffectKinds.COMPANY_WANTS_TO_SELL_MUST_BE_EDITED)
        );

        if (mustBeEditedAnswer?.value) conditionModelValue.value = 1;

        const alreadyDescribedAnswer = form.tab.find(answer =>
            answer.effects.has(quizEffectKinds.COMPANY_WANTS_TO_SELL_ALREADY_DESCRIBED)
        );

        if (alreadyDescribedAnswer?.value) conditionModelValue.value = 0;
    }

    templateRef.value.setForm(form);
}

defineExpose({ getForm, validate, setForm });

// injection

function answersHasFilledAnswer(answers) {
    return answers.some(
        element =>
            element.value === true || (isString(element.value) && isNotEmptyString(element.value))
    );
}

function injectConditionAnswerToForm(form) {
    if (conditionModelValue.value) {
        const answer = form.find(answer =>
            answer.effects.has(quizEffectKinds.COMPANY_WANTS_TO_SELL_MUST_BE_EDITED)
        );

        if (!answer) return;

        answer.value = true;

        if (props.withRelated) {
            const tabAnswers = templateRef.value.getTabAnswers();
            const textAnswers = templateRef.value.getTextAnswers();

            answer.filled =
                answersHasFilledAnswer(tabAnswers) || answersHasFilledAnswer(textAnswers);

            const relatedForm = Object.values(objectsForm.value).map(element => {
                return {
                    id: element.id,
                    answer: {
                        ...element.answer.description,
                        ...element.answer.main,
                        ...element.answer.tab
                    }
                };
            });

            answer.form = {
                offers: Object.values(offersForm.value),
                objects: relatedForm
            };
        } else {
            answer.filled = true;
        }
    } else {
        const answer = form.find(answer =>
            answer.effects.has(quizEffectKinds.COMPANY_WANTS_TO_SELL_ALREADY_DESCRIBED)
        );

        if (answer) answer.value = true;
    }
}

function cancelConditionAnswerInForm(form) {
    let answer = form.find(answer =>
        answer.effects.has(quizEffectKinds.COMPANY_WANTS_TO_SELL_MUST_BE_EDITED)
    );
    if (answer) answer.value = false;

    answer = form.find(answer =>
        answer.effects.has(quizEffectKinds.COMPANY_WANTS_TO_SELL_ALREADY_DESCRIBED)
    );
    if (answer) answer.value = false;
}

watch(conditionModelValue, value => {
    templateRef.value.setCustomCompleted(value === 0);
});

// model value

const offersForm = ref({});
const objectsForm = ref({});

watch(deleteCurrentArea, value => {
    if (value) markOffersAsDisabled();
    else markOffersAsActive();
});

function markOffersAsDisabled() {
    Object.values(offersForm.value).forEach(offer => {
        offer.form.disabled = true;
    });
}

function markOffersAsActive() {
    Object.values(offersForm.value).forEach(offer => {
        offer.form.disabled = false;
    });
}

// modelValue

const store = useStore();

const currentObject = computed(() => {
    return store.state.Messenger.currentDialog?.model?.object;
});
</script>
