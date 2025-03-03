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
                v-model:delete="deleteCurrentFreeAreaModelValue"
                v-model:condition="conditionModelValue"
                @change-hidden="toggleHidden"
                :disabled="mainAnswer !== true"
                :hidden="hidden"
                class="mt-1"
            />
        </template>
        <template v-if="currentCompanyId" #after-content="{ mainAnswer }">
            <MessengerQuizQuestionTemplateHasFreeAreaPicker
                v-model:offers="offersForm"
                v-model:objects="objectsForm"
                :main-answer="mainAnswer"
                :company-id="currentCompanyId"
                :disabled="conditionModelValue === 0 || deleteCurrentFreeAreaModelValue"
                :edit-mode="conditionModelValue === 1"
                :passive-mode="mainAnswer === false"
                :question
                :ignored-effects
                :with-related
                class="mt-2"
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
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { useStore } from 'vuex';
import MessengerQuizQuestionTemplateHasFreeAreaPicker from '@/components/Messenger/Quiz/Question/Template/HasFreeArea/MessengerQuizQuestionTemplateHasFreeAreaPicker.vue';
import { isString } from '@/utils/helpers/string/isString.js';
import { isNotEmptyString } from '@/utils/helpers/string/isNotEmptyString.js';
import { messenger } from '@/const/messenger.js';

const props = defineProps({
    question: {
        type: Object,
        required: true
    },
    canBeDisabled: {
        type: Boolean,
        default: true
    },
    disabled: Boolean,
    withRelated: Boolean
});

const ignoredEffects = new Set([
    quizEffectKinds.OBJECT_FREE_AREA_ALREADY_DESCRIBED,
    quizEffectKinds.OBJECT_FREE_AREA_MUST_BE_EDIT,
    quizEffectKinds.OBJECT_FREE_AREA_MUST_BE_DELETED
]);

const deleteCurrentFreeAreaModelValue = ref(false);
const conditionModelValue = ref(null);

// form

const templateRef = useTemplateRef('questionElement');

function getForm() {
    const form = templateRef.value.getForm();

    const mainAnswer = form.find(answer => answer.type === 'main');

    if (mainAnswer) {
        const actionAnswerMustBeEnabled =
            mainAnswer.value === false && deleteCurrentFreeAreaModelValue.value;

        injectActionAnswerToForm(form, actionAnswerMustBeEnabled, mainAnswer.value);

        if (mainAnswer.value === true) {
            injectConditionAnswerToForm(form);
        } else {
            cancelConditionAnswerInForm(form);
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
        notify.info('Укажите, необходимо ли добавить/редактировать свободные площади..');
        return false;
    }

    return true;
}

function setForm(form) {
    if (isNotNullish(form.main?.value) && form.tab?.length) {
        const mustBeDeletedAnswer = form.tab.find(answer =>
            answer.effects.has(quizEffectKinds.OBJECT_FREE_AREA_MUST_BE_DELETED)
        );

        if (mustBeDeletedAnswer) deleteCurrentFreeAreaModelValue.value = mustBeDeletedAnswer.value;

        const mustBeEditedAnswer = form.tab.find(answer =>
            answer.effects.has(quizEffectKinds.OBJECT_FREE_AREA_MUST_BE_EDIT)
        );

        if (mustBeEditedAnswer?.value) conditionModelValue.value = 1;

        const alreadyDescribedAnswer = form.tab.find(answer =>
            answer.effects.has(quizEffectKinds.OBJECT_FREE_AREA_ALREADY_DESCRIBED)
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

const offerActionOptions = {
    PASSIVE: 0,
    EDIT: 1
};

function injectConditionAnswerToForm(form) {
    if (conditionModelValue.value) {
        const answer = form.find(answer =>
            answer.effects.has(quizEffectKinds.OBJECT_FREE_AREA_MUST_BE_EDIT)
        );

        if (!answer) return;

        answer.value = true;

        const mustBePassiveOffers = Object.values(offersForm.value).filter(
            offer => offer.form.action === offerActionOptions.PASSIVE
        );
        const mustBeEditOffers = Object.values(offersForm.value).filter(
            offer => offer.form.action === offerActionOptions.EDIT
        );

        if (props.withRelated) {
            const tabAnswers = templateRef.value.getTabAnswers();
            const textAnswers = templateRef.value.getTextAnswers();

            answer.filled =
                mustBeEditOffers.length ||
                mustBePassiveOffers.length ||
                answersHasFilledAnswer(tabAnswers) ||
                answersHasFilledAnswer(textAnswers);

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
                objects: relatedForm
            };
        } else {
            answer.filled = true;
        }

        const actionAnswer = form.find(answer =>
            answer.effects.has(quizEffectKinds.OBJECT_FREE_AREA_MUST_BE_EDIT_OFFERS)
        );

        if (!actionAnswer) return;

        actionAnswer.value = {
            passive: mustBePassiveOffers.map(offer => ({
                visual_id: offer.visual_id,
                id: offer.id,
                comment: offer.form.comment
            })),
            edit: mustBeEditOffers.map(offer => ({
                visual_id: offer.visual_id,
                id: offer.id,
                comment: offer.form.comment
            }))
        };
    } else {
        const answer = form.find(answer =>
            answer.effects.has(quizEffectKinds.OBJECT_FREE_AREA_ALREADY_DESCRIBED)
        );

        if (answer) answer.value = true;
    }
}

function cancelConditionAnswerInForm(form) {
    let answer = form.find(answer =>
        answer.effects.has(quizEffectKinds.OBJECT_FREE_AREA_MUST_BE_EDIT)
    );
    if (answer) answer.value = false;

    answer = form.find(answer =>
        answer.effects.has(quizEffectKinds.OBJECT_FREE_AREA_ALREADY_DESCRIBED)
    );
    if (answer) answer.value = false;
}

function injectActionAnswerToForm(form, value, mainAnswer) {
    const answer = form.find(answer =>
        answer.effects.has(quizEffectKinds.OBJECT_FREE_AREA_MUST_BE_DELETED)
    );

    if (isNullish(answer)) return;

    answer.value = value;

    if (mainAnswer === false) {
        const passiveOffersAnswer = form.find(answer =>
            answer.effects.has(quizEffectKinds.OBJECT_FREE_AREA_MUST_BE_PASSIVE_OFFERS)
        );

        if (!passiveOffersAnswer) return;

        if (value) {
            passiveOffersAnswer.value = {
                passive: Object.values(offersForm.value).map(offerAnswer => {
                    return {
                        visual_id: offerAnswer.visual_id,
                        id: offerAnswer.id
                    };
                }),
                active: []
            };
        } else {
            passiveOffersAnswer.value = Object.values(offersForm.value).reduce(
                (acc, offerAnswer) => {
                    const payload = {
                        visual_id: offerAnswer.visual_id,
                        id: offerAnswer.id
                    };

                    if (offerAnswer.form.disabled) acc.passive.push(payload);
                    else acc.active.push(payload);

                    return acc;
                },
                { passive: [], active: [] }
            );
        }
    }
}

watch(conditionModelValue, value => {
    templateRef.value.setCustomCompleted(value === 0);
});

// modelValue

const store = useStore();

const currentCompanyId = computed(() => {
    if (store.state.Messenger.currentDialogType === messenger.dialogTypes.COMPANY)
        return store.state.Messenger.currentDialog.model_id;
    return store.state.Messenger.currentDialog.model.object.company_id;
});

// form

const offersForm = ref({});
const objectsForm = ref({});

watch(deleteCurrentFreeAreaModelValue, value => {
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
</script>
