<template>
    <div class="form__control checkbox-chip">
        <label class="checkbox-chip__label" :class="{ required: required, active: isActive }">
            <input
                v-model="field"
                @change="onChange"
                :value="value"
                :true-value="1"
                :false-value="0"
                type="checkbox"
                :disabled="disabled"
            />
            {{ text ?? value }}
        </label>
        <slot />
    </div>
</template>

<script>
export default {
    name: 'CheckboxChip',
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
        }
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
