<template>
    <div class="radio-group" :class="{ required: required }">
        <p v-if="label" class="radio-group__label">{{ label }}</p>
        <div class="radio-group__list mt-1">
            <label class="radio-chip" :class="{ active: isActive(first) }">
                <input
                    v-model="field"
                    @click="onChange(first)"
                    type="radio"
                    class="radio-chip__input"
                    :class="inputClasses"
                    :value="first"
                />
                {{ firstLabel }}
            </label>
            <label class="radio-chip" :class="{ active: isActive(second) }">
                <input
                    v-model="field"
                    @click="onChange(second)"
                    type="radio"
                    class="radio-chip__input"
                    :class="inputClasses"
                    :value="second"
                />
                {{ secondLabel }}
            </label>
        </div>
        <ValidationMessage v-if="hasValidationError" :message="v.$errors[0].$message" />
    </div>
</template>

<script>
import Mixin from './mixins.js';
import ValidationMessage from '@/components/common/Forms/VaildationMessage.vue';

export default {
    name: 'RadioGroup',
    components: { ValidationMessage },
    mixins: [Mixin],
    props: {
        modelValue: {
            type: [Array, Number, String],
            default: 0
        },
        label: {
            type: String,
            default: null
        },
        firstLabel: {
            type: String,
            default: 'Нет'
        },
        secondLabel: {
            type: String,
            default: 'Да'
        },
        first: {
            type: [String, Number, Boolean, null],
            default: 0
        },
        second: {
            type: [String, Number, Boolean, null],
            default: 1
        },
        unselect: {
            type: Boolean,
            default: false
        },
        v: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            field: this.modelValue
        };
    },
    watch: {
        modelValue() {
            this.field = this.modelValue;
        }
    },
    methods: {
        onChange(value) {
            if (this.unselect && value == this.field) {
                this.field = null;
            } else {
                this.field = value;
            }
            this.validate();
            this.$emit('update:modelValue', this.field);
        },
        isActive(value) {
            return this.modelValue == value;
        }
    }
};
</script>

<style></style>
