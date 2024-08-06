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
            <MessengerButton @click="complete" color="success"> Завершить </MessengerButton>
            <MessengerButton
                v-if="currentStep < steps.length - 1"
                @click="selectStep(currentStep + 1)"
            >
                Далее
            </MessengerButton>
        </div>
    </div>
</template>
<script>
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

export default {
    name: 'Stepper',
    components: { AnimationTransition, MessengerButton },
    emits: ['complete'],
    props: {
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
    },
    data() {
        return {
            currentStep: 0,
            viewed: {}
        };
    },
    computed: {
        progress() {
            return (100 / this.steps.length) * (this.currentStep + 1);
        },
        stepErrors() {
            return this.v[this.steps[this.currentStep].name].$errors;
        }
    },
    methods: {
        selectStep(step) {
            this.validateCurrentStep();

            this._switchStep(step);
        },
        _switchStep(step) {
            this.viewed[this.currentStep] = true;
            this.currentStep = step;
        },
        complete() {
            this.validate();

            if (!this.hasError()) this.$emit('complete');
        },
        validate() {
            if (this.v) this.v.$touch();
        },
        validateCurrentStep() {
            if (this.v && this.v[this.steps[this.currentStep].name])
                this.v[this.steps[this.currentStep].name].$touch();
        },
        stepHasError(step = this.steps[this.currentStep]) {
            if (this.v && this.v[step.name]) {
                return this.v[step.name].$error;
            }

            return false;
        },
        hasError() {
            return this.v?.$error;
        }
    },
    created() {
        this.v.$reset();
    }
};
</script>
