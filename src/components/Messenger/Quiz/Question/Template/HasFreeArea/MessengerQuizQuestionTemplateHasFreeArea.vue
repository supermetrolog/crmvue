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
        <template v-if="currentObject" #after-content="{ mainAnswer }">
            <MessengerQuizQuestionTemplateHasFreeAreaPicker
                v-model:offers="offersForm"
                v-model:objects="objectsForm"
                :main-answer="mainAnswer"
                :company-id="currentObject.company_id"
                :disabled="
                    conditionModelValue === 0 || deleteCurrentFreeAreaModelValue || !withRelated
                "
                :edit-mode="conditionModelValue === 1"
                :passive-mode="mainAnswer === false"
                :question
                :ignored-effects
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

function injectConditionAnswerToForm(form) {
    if (conditionModelValue.value) {
        const answer = form.find(answer =>
            answer.effects.has(quizEffectKinds.OBJECT_FREE_AREA_MUST_BE_EDIT)
        );

        if (answer) {
            answer.value = true;

            if (props.withRelated) {
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
            }
        }
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

    if (answer) {
        answer.value = value;

        if (mainAnswer === false) {
            answer.form = {
                offers: Object.values(offersForm.value)
            };
        }
    }
}

watch(conditionModelValue, value => {
    templateRef.value.setCustomCompleted(value === 0);
});

// modelValue

const store = useStore();

const currentObject = computed(() => {
    return store.state.Messenger.currentDialog?.model?.object;
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
