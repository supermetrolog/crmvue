<template>
    <div class="form__control checkbox-chip">
        <label class="checkbox-chip__label" :class="{ required: required, active: isActive }">
            <input
                v-model="field"
                @change="onChange"
                type="checkbox"
                :class="inputClasses"
                :value="value"
                :true-value="1"
                :false-value="0"
                :disabled="disabled"
            />
            {{ text }}
        </label>
        <slot />
    </div>
</template>

<script>
import Mixin from './mixins.js';

export default {
    name: 'CheckboxChip',
    mixins: [Mixin],
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
        label: {
            type: String,
            default: null
        },
        name: {
            type: String,
            default: null
        },
        disabled: {
            type: Boolean,
            default: false
        },
        value: [String, Number]
    },
    data() {
        return {
            field: this.modelValue
        };
    },
    computed: {
        isActive() {
            return this.field instanceof Array
                ? this.field.includes(this.value) || this.field.includes(this.value.toString())
                : Boolean(this.field);
        }
    },
    watch: {
        modelValue() {
            this.field = this.modelValue;
        }
    },
    methods: {
        onChange() {
            this.$emit('update:modelValue', this.field);
            this.$emit('change', this.field);
        }
    }
};
</script>

<style></style>