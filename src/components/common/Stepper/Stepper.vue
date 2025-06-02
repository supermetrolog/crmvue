<template>
    <div class="stepper">
        <div v-if="showProgress" class="stepper__progress">
            <div class="stepper__progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="stepper__navigation">
            <StepperStep
                v-for="(step, index) in steps"
                :key="index"
                @click.prevent="selectStep(index)"
                :title="step.title"
                :icon="step.icon"
                :number="index + 1"
                :active="index === currentStep"
                :error="stepHasError(step, index)"
                :viewed="!readOnly && viewed[index]"
                :disabled="step.disabled"
                :show-number="showStepNumber"
                :class="step.class"
            />
            <slot name="after-navigation" />
        </div>
        <AnimationTransition>
            <div v-if="stepHasError()" class="stepper__validation">
                <span
                    v-for="(error, key) in stepErrors"
                    :key="key"
                    class="stepper__error animate__animated animate__flash"
                >
                    {{ error.$message }}
                </span>
            </div>
        </AnimationTransition>
        <div class="stepper__body">
            <slot name="body" />
            <template v-if="keepAlive">
                <div
                    v-for="(step, index) in steps"
                    :key="step.name"
                    class="stepper__content"
                    :class="{ active: currentStep === index }"
                >
                    <AnimationTransition>
                        <div v-show="currentStep === index" class="stepper__item">
                            <slot :name="index + 1" />
                        </div>
                    </AnimationTransition>
                </div>
            </template>
            <template v-else>
                <div
                    v-for="(step, index) in steps"
                    :key="step.name"
                    class="stepper__content"
                    :class="{ active: currentStep === index }"
                >
                    <AnimationTransition>
                        <div v-if="currentStep === index" class="stepper__item">
                            <slot :name="index + 1" />
                        </div>
                    </AnimationTransition>
                </div>
            </template>
        </div>
        <div v-if="!readOnly" class="stepper__footer" :class="footerClass">
            <slot name="footer" :complete="complete">
                <UiButton
                    @click="selectStep(currentStep - 1)"
                    :disabled="currentStep === 0"
                    color="white"
                    bolder
                >
                    Назад
                </UiButton>
                <UiButton @click="complete" :disabled="hasError" color="success-light" bolder>
                    Завершить
                </UiButton>
                <UiButton
                    @click="selectStep(currentStep + 1)"
                    :disabled="currentStep === steps.length - 1"
                    color="white"
                    bolder
                >
                    Далее
                </UiButton>
                <slot name="actions" />
            </slot>
        </div>
    </div>
</template>
<script setup>
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { computed, ref, toValue, watch } from 'vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import StepperStep from '@/components/common/Stepper/StepperStep.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { useNotify } from '@/utils/use/useNotify.js';

const currentStep = defineModel('step', { type: Number, default: 0 });
const emit = defineEmits(['complete']);
const props = defineProps({
    keepAlive: Boolean,
    steps: {
        type: Array,
        required: true
    },
    v: Object,
    showProgress: {
        type: Boolean,
        default: true
    },
    footerClass: [String, Array, Object],
    showStepNumber: {
        type: Boolean,
        default: true
    },
    readOnly: Boolean
});

const viewed = ref({});

const progress = computed(() => (100 / props.steps.length) * (currentStep.value + 1));

const stepErrors = computed(() => {
    return props.v[props.steps[currentStep.value].name].$errors;
});

const hasError = computed(() => props.v?.$error || props.v?.$errors?.length > 0);

if (props.v) props.v.$reset();

const _switchStep = step => {
    viewed.value[currentStep.value] = true;
    currentStep.value = step;
};

watch(currentStep, (value, oldValue) => {
    if (isNotNullish(oldValue)) {
        viewed.value[oldValue] = true;
    }
});

const validateCurrentStep = () => {
    if (props.v && props.v[props.steps[currentStep.value].name]) {
        props.v[props.steps[currentStep.value].name].$touch();
    }
};

const selectStep = step => {
    validateCurrentStep();
    _switchStep(step);
};

const complete = () => {
    validate();
    if (!hasError.value) emit('complete');
};

const notify = useNotify();

const validate = async () => {
    if (props.v) {
        await props.v.$validate();
        if (props.v.$errors?.length > 0) {
            notify.info(props.v.$errors[0].$message, 'Ошибка валидации');
        }
    }
};

const stepHasError = (step = props.steps[currentStep.value], stepKey = currentStep.value) => {
    if (props.readOnly) return false;

    if (isNotNullish(step.valid) && !toValue(step.valid)) return viewed.value[stepKey] === true;
    if (props.v && props.v[step.name]) return props.v[step.name].$error;
    return false;
};
</script>
