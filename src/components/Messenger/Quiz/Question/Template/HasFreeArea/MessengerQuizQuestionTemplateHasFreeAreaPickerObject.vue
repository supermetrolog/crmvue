<template>
    <MessengerQuizQuestionTemplateObject
        @show-preview="$emit('show-preview')"
        :object
        :class="{ disabled: disabled, active: active }"
    >
        <template #aside>
            <Checkbox :checked="active" />
        </template>
        <template v-if="active" #after>
            <div @click.stop class="mt-1">
                <div class="d-flex gap-1 flex-wrap">
                    <RadioChip
                        v-for="answer in options"
                        :key="answer.id"
                        v-model="radioModelValue"
                        :value="answer.id"
                        :label="answer.value"
                        :rounded="false"
                        show-radio
                    />
                </div>
                <div v-for="answer in textOptions" :key="answer.id" class="position-relative">
                    <Textarea
                        v-model="modelValue.description[answer.id]"
                        :placeholder="answer.value"
                        auto-height
                        :min-height="50"
                        class="mt-1"
                    />
                </div>
            </div>
        </template>
    </MessengerQuizQuestionTemplateObject>
</template>
<script setup>
import Checkbox from '@/components/common/Forms/Checkbox.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import MessengerQuizQuestionTemplateObject from '@/components/Messenger/Quiz/Question/Template/Object/MessengerQuizQuestionTemplateObject.vue';
import { computed, onMounted, ref, watch } from 'vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import { quizEffectKinds } from '@/const/quiz.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';

defineEmits(['show-preview']);
const modelValue = defineModel();
const props = defineProps({
    object: {
        type: Object,
        required: true
    },
    question: {
        type: Object,
        required: true
    },
    editMode: Boolean,
    passiveMode: Boolean,
    disabled: Boolean,
    active: Boolean,
    ignoredEffects: {
        type: Set,
        default: () => new Set()
    }
});

const freeAreaMustBeEditAnswer = computed(() =>
    props.question.answers.tab.find(answer =>
        answer.effects.some(effect => effect.kind === quizEffectKinds.OBJECT_FREE_AREA_MUST_BE_EDIT)
    )
);

const options = computed(() =>
    props.question.answers.tab.filter(
        element => element.deleted_at === null && checkAnswerIsNotIgnored(element)
    )
);

function checkAnswerIsNotIgnored(answer) {
    return answer.effects.every(effect => !props.ignoredEffects.has(effect.kind));
}

const textOptions = computed(() =>
    props.question.answers['text-answer'].filter(element => element.deleted_at === null)
);

const mainOption = computed(() => props.question.answers['yes-no'][0]);

function clearForm() {
    textOptions.value.forEach(option => {
        modelValue.value.description[option.id] = null;
    });

    options.value.forEach(option => {
        modelValue.value.tab[option.id] = null;
    });

    radioModelValue.value = null;
}

watch(
    () => props.active,
    value => {
        if (!value) clearForm();

        if (mainOption.value) {
            modelValue.value.main[mainOption.value.id] = value;
        }

        if (freeAreaMustBeEditAnswer.value) {
            modelValue.value.tab[freeAreaMustBeEditAnswer.value.id] = value;
        }
    }
);

// radio

const radioModelValue = ref(null);

watch(radioModelValue, value => {
    if (isNullish(value)) return;

    options.value.forEach(option => {
        modelValue.value.tab[option.id] = value === option.id;
    });
});

function setDefaultRadioModelValue() {
    options.value.forEach(option => {
        if (modelValue.value.tab[option.id]) radioModelValue.value = option.id;
    });
}

onMounted(() => {
    setDefaultRadioModelValue();
});
</script>
