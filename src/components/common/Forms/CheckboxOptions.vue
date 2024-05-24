<template>
    <div>
        <span class="form__label">{{ label }}</span>
        <div class="form__row mt-1">
            <CheckboxChip
                v-for="(option, key) in options"
                :key="key"
                v-model="field"
                :value="option.value"
                :text="option.label"
                :disabled="disabled"
            />
        </div>
        <ValidationMessage v-if="hasValidationError" :message="v.$errors[0].$message" />
    </div>
</template>

<script>
import Mixin from './mixins.js';
import ValidationMessage from '@/components/common/Forms/VaildationMessage.vue';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';

export default {
    name: 'CheckboxOptions',
    components: { CheckboxChip, ValidationMessage },
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
        options: {
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
            field: this.modelValue
        };
    },
    watch: {
        modelValue() {
            this.field = this.modelValue;
        },
        field() {
            this.validate();
            this.$emit('update:modelValue', this.field);
        }
    },
    methods: {
        isActive(value) {
            return this.modelValue == value;
        }
    }
};
</script>

<style></style>
