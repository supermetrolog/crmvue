<template>
    <div class="form__control checkbox-chip">
        <label
            class="checkbox-chip__label"
            :class="{
                required: required,
                active: isActive,
                disabled: isDisabled,
                'checkbox-chip__label--danger': danger,
                'checkbox-chip__label--icon': !text && icon,
                invalid: hasValidationError && !disabled
            }"
        >
            <input
                v-model="field"
                @change="onChange"
                @click="onClick"
                :disabled="disabled"
                :value="value"
                :true-value="1"
                :false-value="0"
                type="checkbox"
            />
            {{ text }}
            <i v-if="icon" :class="icon"></i>
        </label>
        <slot />
    </div>
</template>

<script>
import Mixin from './mixins.js';
export default {
    name: 'CheckboxChip',
    mixins: [Mixin],
    emits: ['change', 'update:modelValue'],
    props: {
        modelValue: {
            type: [Array, Number, String, Boolean],
            default: () => []
        },
        text: {
            type: [String, Number, null],
            default: null
        },
        required: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            default: null
        },
        disabled: {
            type: Boolean,
            default: false
        },
        value: {
            type: [String, Number, Boolean],
            default: false
        },
        icon: {
            type: String,
            default: null
        },
        danger: {
            type: Boolean,
            default: false
        },
        v: {
            type: Object,
            default: null
        },
        multiple: {
            type: Boolean,
            default: null
        },
        property: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            field: this.modelValue
        };
    },
    computed: {
        isActive() {
            if (this.field instanceof Array) {
                if (this.property === null) {
                    return (
                        this.field.includes(this.value) ||
                        this.field.includes(this.value.toString())
                    );
                }

                return this.field.some(element => element[this.property] == this.value);
            }

            if (this.multiple) return this.field == 1;

            return Boolean(this.field);
        },
        isDisabled() {
            return this.multiple && this.field == 0;
        }
    },
    watch: {
        modelValue() {
            this.field = this.modelValue;
        }
    },
    methods: {
        onClick(event) {
            if (this.property === null) return true;

            event.preventDefault();

            if (this.isActive)
                this.field = [
                    ...this.field.filter(element => element[this.property] != this.value)
                ];
            else this.field = [...this.field, { [this.property]: this.value }];

            this.onChange();
        },
        onChange() {
            this.validate();

            if (this.multiple && this.modelValue == 0) {
                this.field = null;
            }

            this.$emit('update:modelValue', this.field);
            this.$emit('change', this.field);
        }
    }
};
</script>

<style></style>
