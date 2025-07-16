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
            <SurveyFormObjectContent @show-map="$emit('show-map')" :object :company />
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
                    <UiDropdownActionsNested
                        label="Указать статус"
                        icon="fa-solid fa-lightbulb"
                        :active="success"
                    >
                        <template #menu>
                            <UiDropdownActionsGroup>
                                <UiDropdownActionsButton
                                    @handle="markAs(1)"
                                    :active="answer === 1"
                                    label="Без изменений"
                                    icon="fa-solid fa-thumbs-up"
                                    :close-on-click="false"
                                />
                                <UiDropdownActionsButton
                                    @handle="markAs(2)"
                                    :active="answer === 2"
                                    label="Больше не актуально"
                                    icon="fa-solid fa-thumbs-down"
                                    :close-on-click="false"
                                />
                                <UiDropdownActionsButton
                                    @handle="markAs(3)"
                                    :active="answer === 3"
                                    label="Не опросил"
                                    icon="fa-solid fa-phone-slash"
                                    :close-on-click="false"
                                />
                            </UiDropdownActionsGroup>
                            <UiDropdownActionsGroup>
                                <UiDropdownActionsButton
                                    @handle="markAs(5)"
                                    :active="answer === 5"
                                    label="Объект продан"
                                    icon="fa-solid fa-dollar-sign"
                                    :close-on-click="false"
                                />
                                <UiDropdownActionsButton
                                    @handle="markAs(6)"
                                    :active="answer === 6"
                                    label="Объект снесен"
                                    icon="fa-solid fa-ban"
                                    :close-on-click="false"
                                />
                            </UiDropdownActionsGroup>
                        </template>
                        <template v-if="success" #footer>
                            <UiDropdownActionsButton
                                @handle="clearAnswer"
                                label="Отменить выбор"
                                icon="fa-solid fa-rotate-left"
                                :close-on-click="false"
                            />
                        </template>
                    </UiDropdownActionsNested>
                    <UiDropdownActionsButton
                        @handle="$emit('create-task')"
                        label="Создать задачу"
                        icon="fa-solid fa-bolt"
                    />
                </template>
            </UiDropdownActions>
            <UiCheckbox
                v-if="!disabled"
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
import UiDropdownActionsNested from '@/components/common/UI/DropdownActions/UiDropdownActionsNested.vue';
import UiDropdownActionsGroup from '@/components/common/UI/DropdownActions/UiDropdownActionsGroup.vue';

const form = defineModel({ type: Object, default: () => ({}) });

defineEmits(['show-preview', 'show-map', 'select', 'create-task', 'toggle-checked']);

const props = defineProps({
    object: {
        type: Object,
        required: true
    },
    company: Object,
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

const answer = computed({
    get() {
        return isNotNullish(form.value.answer) ? Number(form.value.answer) : null;
    },
    set(value) {
        form.value.answer = value;
    }
});

const success = computed(() => isNotNullish(answer.value));

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

function markAs(value) {
    answer.value = value;

    form.value.checked = true;
}

function clearAnswer() {
    answer.value = null;
    form.value.checked = false;
}
</script>
