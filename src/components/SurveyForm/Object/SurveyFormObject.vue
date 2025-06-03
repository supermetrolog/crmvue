<template>
    <div class="survey-form-object hover-actions-trigger">
        <HoverActions v-if="editable">
            <HoverActionsButton
                @click="modelValue.answer = 1"
                :active="modelValue.answer == 1"
                label="Обработано"
            >
                <i class="fa-solid fa-check"></i>
            </HoverActionsButton>
            <HoverActionsButton
                @click="modelValue.answer = 2"
                :active="modelValue.answer == 2"
                label="Без изменений"
            >
                <i class="fa-solid fa-thumbs-up"></i>
            </HoverActionsButton>
            <HoverActionsButton
                @click="modelValue.answer = 3"
                :active="modelValue.answer == 3"
                label="Не опрашивал"
            >
                <i class="fa-solid fa-phone-slash"></i>
            </HoverActionsButton>
        </HoverActions>
        <div
            @click="$emit('select')"
            class="survey-form-object__body pb-2"
            :class="{
                active,
                success,
                danger,
                warning: modelValue.answer == 2,
                disabled: modelValue.answer == 3
            }"
        >
            <SurveyFormObjectPreview
                @show-preview="$emit('show-preview')"
                @show-map="$emit('show-map')"
                :object
            />
            <SurveyFormObjectContent :object />
            <div v-if="editable" class="survey-form-object__actions">
                <UiButtonIcon
                    @click.stop="$emit('object-sold')"
                    icon="fa-solid fa-dollar-sign"
                    class="dashboard-bg-danger-l survey-form-object__action"
                    label="Объект продан"
                    small
                />
                <UiButtonIcon
                    @click.stop="$emit('object-destroyed')"
                    icon="fa-solid fa-ban"
                    class="dashboard-bg-danger-l survey-form-object__action"
                    label="Объект снесен"
                    small
                />
            </div>
        </div>
        <UiAccordion>
            <template #trigger="{ toggle, opened }">
                <UiAccordionButton
                    @click="toggle"
                    :class="parametersClass"
                    :label="parametersTitle"
                    :opened="opened"
                    icon="fa-solid fa-warning"
                    expand-class="ml-auto"
                    class="w-100 br-0"
                />
            </template>
            <template #body>
                <MessengerDialogObjectPreview
                    @changed-warnings="parametersHasWarnings = $event"
                    class="survey-form-object__panel"
                    :object
                    :show-offers="false"
                />
            </template>
        </UiAccordion>
    </div>
</template>
<script setup>
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import SurveyFormObjectContent from '@/components/SurveyForm/Object/SurveyFormObjectContent.vue';
import SurveyFormObjectPreview from '@/components/SurveyForm/Object/SurveyFormObjectPreview.vue';
import MessengerDialogObjectPreview from '@/components/Messenger/Dialog/Object/MessengerDialogObjectPreview.vue';
import UiAccordion from '@/components/common/UI/Accordion/UiAccordion.vue';
import { computed, ref } from 'vue';
import UiAccordionButton from '@/components/common/UI/Accordion/UiAccordionButton.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import HoverActions from '@/components/common/HoverActions/HoverActions.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';

const modelValue = defineModel({ type: Object, default: () => ({}) });

defineEmits(['show-preview', 'show-map', 'object-sold', 'object-destroyed', 'select']);

defineProps({
    object: {
        type: Object,
        required: true
    },
    disabled: Boolean,
    active: Boolean,
    editable: Boolean
});

const parametersHasWarnings = ref(false);

const parametersTitle = computed(() => {
    if (parametersHasWarnings.value) {
        return 'Объект имеет недочеты в заполнении!';
    }

    return 'Просмотреть параметры объекта';
});

const parametersClass = computed(() => {
    if (parametersHasWarnings.value) {
        return 'text-danger bg-white survey-form-object__accordion';
    }

    return undefined;
});

const answers = computed(() => {
    if (isNullish(modelValue.value.current)) return [];

    return Object.values(modelValue.value.current);
});

const success = computed(() => {
    return (
        (answers.value.length > 0 &&
            answers.value.every(
                answer => isNotNullish(answer.answer) && Number(answer.answer) !== 0
            )) ||
        modelValue.value.answer == 1
    );
});

const danger = computed(() => {
    return answers.value.length > 0 && !success.value;
});
</script>
