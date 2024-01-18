<template>
    <div class="form__control" :class="{ 'form__control--disabled': disabled }">
        <span v-if="label" class="form__label">{{ label }}</span>
        <div class="double-input">
            <label>
                <span class="form__caption">от</span>
                <input
                    ref="input"
                    @input="onFirstInput($event.target.value.trim())"
                    @keypress.enter.prevent
                    class="form__input form__input--title"
                    :class="[inputClasses, { 'form__input--unit': unit, invalid: firstHasErrors }]"
                    :style="paddingRightStyle"
                    :type="type"
                    :disabled="disabled"
                    :value="first"
                />
                <span v-if="unit" ref="unit" class="form__unit" v-html="unit"></span>
            </label>
            <label>
                <span class="form__caption">до</span>
                <input
                    ref="input"
                    @input="onSecondInput($event.target.value.trim())"
                    @keypress.enter.prevent
                    class="form__input form__input--title"
                    :class="[inputClasses, { 'form__input--unit': unit, invalid: secondHasErrors }]"
                    :style="paddingRightStyle"
                    :type="type"
                    :disabled="disabled"
                    :value="second"
                />
                <span v-if="unit" ref="unit" class="form__unit" v-html="unit"></span>
            </label>
        </div>
        <ValidationMessage v-if="errors.length" :message="errors[0].message" />
    </div>
</template>

<script>
import Mixin from './mixins.js';
import ValidationMessage from '@/components/common/Forms/VaildationMessage.vue';

export default {
    name: 'DoubleInput',
    components: { ValidationMessage },
    mixins: [Mixin],
    props: {
        first: {
            type: [String, Number],
            default: ''
        },
        second: {
            type: [String, Number],
            default: ''
        },
        required: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        v: {
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
        }
    },
    data() {
        return {
            paddingRightStyle: null
        };
    },
    computed: {
        firstHasErrors() {
            return this.errors.some(element => element.property && element.property === 'first');
        },
        secondHasErrors() {
            return this.errors.some(element => element.property && element.property === 'second');
        },
        errors() {
            // Валидация и поиск ошибок для каждого из инпутов
            return this.validators.reduce((acc, validator) => {
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
        }
    },
    methods: {
        onFirstInput(value) {
            if (value !== this.first) {
                this.validate();
                this.$emit('update:first', value);
            }
        },
        onSecondInput(value) {
            if (value !== this.second) {
                this.validate();
                this.$emit('update:second', value);
            }
        }
    },
    created() {
        if (this.unit) {
            let unitWidth = this.unit.replaceAll('/', '').replaceAll('<sup>', '').length * 10;
            this.paddingRightStyle = `padding-right: ${unitWidth + 20}px`;
        }
    }
};
</script>
