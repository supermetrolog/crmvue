<template>
    <UiModal
        v-model:visible="visibleModel"
        @closed="$emit('closed')"
        class="survey-form-stepper-summary"
        :title
        :width="900"
    >
        <UiForm>
            <UiFormGroup>
                <UiCol :cols="7" class="survey-form-stepper-summary__grid">
                    <SurveyFormStepperSummaryCard
                        name="Контакты"
                        :current="completedContactsLength"
                        :total="contacts.length"
                        :success-count="0"
                    />
                    <SurveyFormStepperSummaryCard
                        name="Запросы"
                        :current="completedRequestsLength"
                        :total="requests.length"
                    />
                    <SurveyFormStepperSummaryCard
                        name="Предложения"
                        :current="completedObjectsLength"
                        :total="objects.length"
                    />
                    <SurveyFormStepperSummaryCard
                        name="Прочее"
                        :current="completedOtherLength"
                        :total="otherQuestions.length"
                    />
                </UiCol>
                <VueEditor
                    v-model="form.comment"
                    :v="v$.comment"
                    :toolbar="false"
                    label="Комментарий"
                    placeholder="Оставьте комментарий к опросу.."
                    class="col-5"
                    :min-height="250"
                    :max-height="250"
                />
            </UiFormGroup>
        </UiForm>
        <template #actions="{ close }">
            <UiButton @click="complete" icon="fa-solid fa-check" color="success">
                Сохранить опрос
            </UiButton>
            <UiButton @click="close" icon="fa-solid fa-ban" color="light">
                Вернуться к опросу
            </UiButton>
        </template>
    </UiModal>
</template>
<script setup lang="ts">
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';
import { computed } from 'vue';
import { isNullish } from '@/utils/helpers/common/isNullish';
import { useValidation } from '@/composables/useValidation';
import { helpers, maxLength, minLength } from '@vuelidate/validators';
import UiCol from '@/components/common/UI/UiCol.vue';
import SurveyFormStepperSummaryCard from '@/components/SurveyForm/SurveyFormStepperSummaryCard.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';

const emit = defineEmits<{
    (e: 'complete'): void;
    (e: 'closed'): void;
}>();

interface SurveyFormCall {
    available?: boolean | null;
    scheduled?: string | null;
    full_name?: string;
    reason?: number | null;
    delete?: boolean;
    description?: string | null;
}

interface SurveyFormCurrentObject {
    answer?: boolean | null;
    created?: object[];
    arendators?: object[];
    current?: object;
}

interface SurveyFormObjects {
    current: SurveyFormProperty<SurveyFormCurrentObject>;
}

interface SurveyFormCurrentRequest {
    answer?: boolean | null;
    description?: string | null;
    snapshot?: object;
}

interface SurveyFormRequests {
    current: SurveyFormProperty<SurveyFormCurrentRequest>;
}

type SurveyFormProperty<T> = Record<string, T>;

interface SurveyForm {
    calls: SurveyFormProperty<SurveyFormCall>;
    objects: SurveyFormObjects;
    requests: SurveyFormRequests;
    other: object[];
    comment: string | null;
}

const visibleModel = defineModel<boolean>('visible');
const form = defineModel<SurveyForm>('form');

interface Props {
    editMode: boolean;
    objects: object[];
    requests: object[];
    other: object[];
    contacts: object[];
    survey: object;
}

const props = defineProps<Props>();

const { v$, validate } = useValidation(
    {
        comment: {
            maxLength: helpers.withMessage(
                'Комментарий не может быть больше 512 символов',
                maxLength(512)
            ),
            minLength: helpers.withMessage(
                'Комментарий не может быть меньше 8 символов',
                minLength(8)
            )
        }
    },
    form,
    { notification: true }
);

async function complete() {
    const isValid = await validate();
    if (!isValid) return;

    emit('complete');
}

const completedContactsLength = computed(() => {
    if (isNullish(form.value)) return 0;

    return Object.values(form.value.calls).filter(
        call =>
            (isNotNullish(call.available) && isNotNullish(call.reason)) ||
            Object.values(call.phones ?? {}).some(
                phone => isNotNullish(phone.available) && isNotNullish(phone.reason)
            ) ||
            Object.values(call.emails ?? {}).some(email => isNotNullish(email.available))
    ).length;
});

const completedObjectsLength = computed(() => {
    if (isNullish(form.value)) return 0;

    return Object.values(form.value.objects.current).filter(object => isNotNullish(object.answer))
        .length;
});

const completedRequestsLength = computed(() => {
    if (isNullish(form.value)) return 0;

    return Object.values(form.value.requests.current).filter(object => isNotNullish(object.answer))
        .length;
});

const otherQuestions = computed(() => {
    if (isNullish(form.value)) return [];

    return Object.values(
        form.value.other.reduce((acc, question) => {
            if (acc[question.question_id]) {
                acc[question.question_id].push(question);
            } else {
                acc[question.question_id] = [question];
            }

            return acc;
        }, {})
    );
});

const completedOtherLength = computed(() => {
    return otherQuestions.value.filter(group =>
        group.some(
            element =>
                isNotNullish(element) && element.type === 'main' && isNotNullish(element.value)
        )
    ).length;
});

const progress = computed(() => {
    if (isNullish(form.value)) return 0;

    const totalValue =
        otherQuestions.value.length + props.objects.length + props.requests.length + 1;
    const value =
        completedObjectsLength.value +
        completedRequestsLength.value +
        completedOtherLength.value +
        1;

    return Math.floor((value / totalValue) * 100);
});

const title = computed(() => {
    if (!visibleModel.value) return 'Обработка запроса';
    if (props.editMode) return 'Завершение редактирования';
    return `Запрос обработан на ${progress.value}%`;
});
</script>
