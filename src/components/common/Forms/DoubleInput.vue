<template>
    <div
        class="form__control"
        :class="{
            'form__control--disabled': disabled,
            'form__control--reactive': reactive,
            required: required
        }"
    >
        <span v-if="label" class="form__label">{{ label }}</span>
        <div class="double-input">
            <label>
                <span v-if="!withoutCaption" class="form__caption">{{ firstLabel }}</span>
                <input
                    ref="input"
                    @input="onFirstInput($event.target.value.trim())"
                    @keypress.enter.prevent
                    class="form__input"
                    :class="[
                        firstInputValidationClass,
                        paddingLeftStyleFirst,
                        { 'form__input--unit': unit, 'form__input--title': !withoutCaption }
                    ]"
                    :style="[paddingRightStyle.first, paddingLeftStyleFirst]"
                    :type="type"
                    :disabled="disabled"
                    :value="first"
                />
                <span v-if="unit" ref="unit" class="form__unit" v-html="unit"></span>
                <ValidationInfo v-if="firstHasValidationInfo" :errors="firstInputErrors" />
            </label>
            <i v-if="withoutCaption" class="form__separator fa-solid fa-x" />
            <label>
                <span v-if="!withoutCaption" class="form__caption">{{ secondLabel }}</span>
                <input
                    ref="input"
                    @input="onSecondInput($event.target.value.trim())"
                    @keypress.enter.prevent
                    class="form__input"
                    :class="[
                        secondInputValidationClass,
                        { 'form__input--unit': unit, 'form__input--title': !withoutCaption }
                    ]"
                    :style="[paddingRightStyle.second, paddingLeftStyleSecond]"
                    :type="type"
                    :disabled="disabled"
                    :value="second"
                />
                <span v-if="unit" ref="unit" class="form__unit" v-html="unit"></span>
                <ValidationInfo v-if="secondHasValidationInfo" :errors="secondInputErrors" />
            </label>
        </div>
        <ValidationMessage v-if="errors.length" :message="errors[0].message" />
    </div>
</template>

<script>
import Mixin from './mixins.js';
import ValidationMessage from '@/components/common/Forms/VaildationMessage.vue';
import ValidationInfo from '@/components/common/Forms/ValidationInfo.vue';
import { empty } from '@//validators';

export default {
    name: 'DoubleInput',
    components: { ValidationInfo, ValidationMessage },
    mixins: [Mixin],
    props: {
        first: {
            type: [String, Number],
            default: null
        },
        second: {
            type: [String, Number],
            default: null
        },
        v: {
            type: Object,
            default: null
        },
        vFirst: {
            type: Object,
            default: null
        },
        vSecond: {
            type: Object,
            default: null
        },
        type: {
            type: String,
            default: 'text'
        },
        label: {
            type: String,
            default: null
        },
        unit: {
            type: String,
            default: null
        },
        validators: {
            type: Array,
            default: () => []
        },
        withoutCaption: {
            type: Boolean,
            default: false
        },
        firstLabel: {
            type: String,
            default: 'от'
        },
        secondLabel: {
            type: String,
            default: 'до'
        }
    },
    computed: {
        firstHasErrors() {
            return (
                (this.vFirst && this.vFirst.$error) ||
                this.errors.some(element => element.property && element.property === 'first')
            );
        },
        secondHasErrors() {
            return this.errors.some(element => element.property && element.property === 'second');
        },
        errors() {
            // Валидация и поиск ошибок для каждого из инпутов
            const customErrors = this.validators.reduce((acc, validator) => {
                if (validator.property)
                    return !validator.func(this[validator.property])
                        ? [...acc, { message: validator.message, property: validator.property }]
                        : acc;

                const currentErrors = [];

                if (!validator.func(this.first))
                    currentErrors.push({ message: validator.message, property: 'first' });
                if (!validator.func(this.second))
                    currentErrors.push({ message: validator.message, property: 'second' });

                return [...acc, ...currentErrors];
            }, []);

            let vuelidateErrors = [];

            if (this.vFirst && this.vFirst.$error)
                vuelidateErrors = [
                    ...this.vFirst.$errors.map(element => ({
                        message: element.$message,
                        property: 'first'
                    }))
                ];

            if (this.vSecond && this.vSecond.$error)
                vuelidateErrors = [
                    ...vuelidateErrors,
                    ...this.vSecond.$errors.map(element => ({
                        message: element.$message,
                        property: 'second'
                    }))
                ];

            return [...customErrors, ...vuelidateErrors];
        },
        paddingRightStyle() {
            // Расчет ширины блока с единицой измерения
            if (this.unit) {
                const unitWidth = this.unit.replaceAll('/', '').replaceAll('<sup>', '').length * 10;

                const firstValidationWidth = this.firstHasValidationInfo ? 20 : 0;
                const secondValidationWidth = this.secondHasValidationInfo ? 20 : 0;

                return {
                    first: `padding-right: ${unitWidth + 20 + firstValidationWidth}px`,
                    second: `padding-right: ${unitWidth + 20 + secondValidationWidth}px`
                };
            }

            return {
                first: null,
                second: null
            };
        },
        paddingLeftStyleFirst() {
            return `padding-left: ${this.firstLabel.length * 12 + 14}px`;
        },
        paddingLeftStyleSecond() {
            return `padding-left: ${this.secondLabel.length * 12 + 14}px`;
        },
        firstInputErrors() {
            return this.errors.filter(element => !element.property || element.property === 'first');
        },
        secondInputErrors() {
            return this.errors.filter(
                element => !element.property || element.property === 'second'
            );
        },
        firstInputValidationClass() {
            return {
                invalid: this.firstHasErrors,
                valid:
                    !this.firstHasErrors && !empty(this.first) && !this.disabled && !this.reactive
            };
        },
        secondInputValidationClass() {
            return {
                invalid: this.secondHasErrors,
                valid:
                    !this.secondHasErrors && !empty(this.second) && !this.disabled && !this.reactive
            };
        },
        firstHasValidationInfo() {
            return (this.firstHasErrors || !empty(this.first)) && !this.disabled && !this.reactive;
        },
        secondHasValidationInfo() {
            return (
                (this.secondHasErrors || !empty(this.second)) && !this.disabled && !this.reactive
            );
        }
    },
    methods: {
        onFirstInput(value) {
            if (value !== this.first) {
                this.validate();
                if (this.vFirst) this.vFirst.$touch();
                this.$emit('update:first', value);
            }
        },
        onSecondInput(value) {
            if (value !== this.second) {
                this.validate();
                if (this.vSecond) this.vSecond.$touch();
                this.$emit('update:second', value);
            }
        }
    }
};
</script>
