<template>
    <div class="stepper">
        <div class="stepper__progress">
            <div class="stepper__progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="stepper__navigation">
            <a
                v-for="(step, index) in steps"
                :key="index"
                @click.prevent="selectStep(index)"
                href=""
                class="stepper__step"
                :class="{
                    active: index === currentStep,
                    error: stepHasError(step),
                    viewed: viewed[index]
                }"
            >
                <span class="stepper__step-id">{{ index + 1 }}</span>
                <span>{{ step.title }}</span>
            </a>
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
        <div class="stepper__footer">
            <MessengerButton v-if="currentStep > 0" @click="selectStep(currentStep - 1)">
                Назад
            </MessengerButton>
            <MessengerButton @click="complete" color="success" :disabled="hasError">
                Завершить
            </MessengerButton>
            <MessengerButton
                v-if="currentStep < steps.length - 1"
                @click="selectStep(currentStep + 1)"
            >
                Далее
            </MessengerButton>
        </div>
    </div>
</template>
<script setup>
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { computed, ref } from 'vue';

const currentStep = defineModel('step', { type: Number, default: 0 });
const emit = defineEmits(['complete']);
const props = defineProps({
    keepAlive: {
        type: Boolean,
        default: false
    },
    steps: {
        type: Array,
        required: true
    },
    v: {
        type: Object,
        default: null
    }
});

const viewed = ref({});

const progress = computed(() => (100 / props.steps.length) * (currentStep.value + 1));
const stepErrors = computed(() => {
    return props.v[props.steps[currentStep.value].name].$errors;
});
const hasError = computed(() => props.v?.$error || props.v.$errors?.length > 0);

if (props.v) props.v.$reset();
const _switchStep = step => {
    viewed.value[currentStep.value] = true;
    currentStep.value = step;
};

const validateCurrentStep = () => {
    if (props.v && props.v[props.steps[currentStep.value].name])
        props.v[props.steps[currentStep.value].name].$touch();
};

const selectStep = step => {
    validateCurrentStep();
    _switchStep(step);
};

const complete = () => {
    validate();
    if (!hasError.value) emit('complete');
};
const validate = () => {
    if (props.v) props.v.$touch();
};
const stepHasError = (step = props.steps[currentStep.value]) => {
    if (props.v && props.v[step.name]) return props.v[step.name].$error;
    return false;
};
</script>
