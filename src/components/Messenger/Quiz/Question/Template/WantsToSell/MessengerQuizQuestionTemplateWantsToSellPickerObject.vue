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
            <div @click.stop>
                <div class="d-flex gap-1 flex-wrap">
                    <RadioChip
                        v-for="answer in options"
                        :key="answer.id"
                        v-model="modelValue.tab[answer.id]"
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
import { computed, watch } from 'vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';

defineEmits(['show-preview']);
const modelValue = defineModel();
const props = defineProps({
    object: {
        type: Object,
        required: true
    },
    editMode: Boolean,
    passiveMode: Boolean,
    disabled: Boolean,
    active: Boolean,
    question: {
        type: Object,
        required: true
    },
    ignoredEffects: {
        type: Set,
        default: () => new Set()
    }
});

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
}

watch(
    () => props.active,
    value => {
        if (!value) clearForm();

        modelValue.value.main[mainOption.value.id] = value;
    }
);
</script>
