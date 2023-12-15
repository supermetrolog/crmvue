<template>
    <div class="form__control checkbox-chip">
        <label class="checkbox-chip__label" :class="{ required: required, active: isActive }">
            <input
                v-model="field"
                @change.stop="onChange"
                type="checkbox"
                :class="inputClasses"
                :value="value"
                :disabled="disabled"
            />
            {{ text }}
        </label>
        <div v-if="v && v.$error" class="form__error pt-0">
            <p>{{ v.$errors[0].$message }}</p>
        </div>
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
        text: String,
        required: {
            type: Boolean,
            default: false
        },
        v: {
            type: Object,
            default: null
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
            this.validate();
            if (!(this.field instanceof Array)) this.field = Number(this.field);
            this.$emit('update:modelValue', this.field);
            this.$emit('change', this.field);
        }
    }
};
</script>

<style></style>