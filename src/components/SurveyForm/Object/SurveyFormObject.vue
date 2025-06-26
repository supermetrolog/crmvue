<template>
    <div
        class="survey-form-object"
        :class="{
            success
        }"
    >
        <div @click="$emit('select')" class="survey-form-object__body" :class="{ active }">
            <SurveyFormObjectPreview
                @show-preview="$emit('show-preview')"
                @show-map="$emit('show-map')"
                :object
                :answer="form?.answer"
            />
            <SurveyFormObjectContent @show-map="$emit('show-map')" :object />
        </div>
        <div v-if="editable" class="survey-form-object__aside">
            <UiDropdownActions>
                <template #trigger>
                    <UiDropdownActionsTrigger
                        label="Действия над строением"
                        color="light"
                        class="op-7"
                    />
                </template>
                <template #menu>
                    <UiDropdownActionsButton
                        @handle="$emit('create-task')"
                        label="Создать задачу"
                        icon="fa-solid fa-bolt"
                    />
                    <UiDropdownActionsButton
                        @handle="$emit('object-sold')"
                        label="Объект продан"
                        icon="fa-solid fa-dollar-sign"
                    />
                    <UiDropdownActionsButton
                        @handle="$emit('object-destroyed')"
                        label="Объект снесен"
                        icon="fa-solid fa-ban"
                    />
                </template>
            </UiDropdownActions>
            <UiCheckbox
                @change="$emit('toggle-checked', $event)"
                :checked
                class="survey-form-object__checkbox"
            />
            <AnimationTransition :speed="0.5">
                <UiTooltipIcon
                    v-if="success"
                    tooltip="Строение заполнено!"
                    class="survey-form-object__icon"
                    icon="fa-solid fa-check-circle text-success"
                />
                <UiTooltipIcon
                    v-else-if="hasWarnings && !isViewed"
                    tooltip="Строение имеет недочеты в заполнении!"
                    class="survey-form-object__icon"
                    icon="fa-solid fa-exclamation-circle text-danger"
                />
            </AnimationTransition>
        </div>
    </div>
</template>
<script setup>
import SurveyFormObjectContent from '@/components/SurveyForm/Object/SurveyFormObjectContent.vue';
import SurveyFormObjectPreview from '@/components/SurveyForm/Object/SurveyFormObjectPreview.vue';
import { computed, ref, watch } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import { isNullish } from '@/utils/helpers/common/isNullish.ts';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import UiDropdownActionsTrigger from '@/components/common/UI/DropdownActions/UiDropdownActionsTrigger.vue';
import UiCheckbox from '@/components/common/Forms/UiCheckbox.vue';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

const form = defineModel({ type: Object, default: () => ({}) });

defineEmits([
    'show-preview',
    'show-map',
    'object-sold',
    'object-destroyed',
    'select',
    'create-task',
    'toggle-checked'
]);

const props = defineProps({
    object: {
        type: Object,
        required: true
    },
    disabled: Boolean,
    active: Boolean,
    editable: Boolean,
    checked: Boolean
});

const isViewed = ref(false);

const stopWatch = watch(
    () => props.active,
    value => {
        if (value) {
            isViewed.value = true;
            stopWatch();
        }
    }
);

const success = computed(() => isNotNullish(form.value.answer));

const hasWarnings = computed(() => {
    if (isNullish(props.object)) return false;

    return (
        props.object.photo?.length < 5 ||
        !props.object.power ||
        !props.object.water ||
        !props.object.sewage ||
        !props.object.railway
    );
});
</script>
