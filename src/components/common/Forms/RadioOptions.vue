<template>
    <div>
        <span class="form__label">{{ label }}</span>
        <div class="form__row mt-1">
            <RadioChip
                v-for="(option, key) in options"
                :key="key"
                v-model="field"
                :value="option.value"
                :label="option.label"
                :unselect="unselect"
                :disabled="disabled"
            />
        </div>
        <ValidationMessage v-if="hasValidationError" :message="v.$errors[0].$message" />
    </div>
</template>

<script>
import Mixin from './mixins.js';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import ValidationMessage from '@/components/common/Forms/VaildationMessage.vue';

export default {
    name: 'RadioOptions',
    components: { ValidationMessage, RadioChip },
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
        unselect: {
            type: Boolean,
            default: false
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
