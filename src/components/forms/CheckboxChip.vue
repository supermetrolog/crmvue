<template>
    <div class="form__control checkbox-chip">
        <label class="checkbox-chip__label" :class="{ required: required, active: isActive }">
            <input
                type="checkbox"
                v-model="field"
                :class="inputClasses"
                :value="value"
                @change.stop="onChange"
                :disabled="disabled"
            />
            {{ text }}
        </label>
        <div class="form__error pt-0" v-if="v && v.$error">
            <p>{{ v.$errors[0].$message }}</p>
        </div>
        <slot/>
    </div>
</template>

<script>
import Mixin from "./mixins.js";

export default {
    mixins: [Mixin],
    name: "CheckboxChip",
    data() {
        return {
            field: this.modelValue,
        };
    },
    props: {
        modelValue: {
            type: [Array, Number, String, Boolean],
            default: () => [],
        },
        text: String,
        required: {
            type: Boolean,
            default: false,
        },
        v: {
            type: Object,
            default: null,
        },
        label: {
            type: String,
            default: null,
        },
        name: {
            type: String,
            default: null,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        value: [String, Number]
    },
    methods: {
        onChange() {
            this.validate();
            if (!(this.field instanceof Array)) this.field = Number(this.field);
            this.$emit("update:modelValue", this.field);
            this.$emit("change", this.field);
        }
    },
    watch: {
        modelValue() {
            this.field = this.modelValue;
        },
    },
    computed: {
        isActive() {
            return this.field instanceof Array ?
                this.field.includes(this.value)
                || this.field.includes(this.value.toString()):
                Boolean(this.field)
        }
    }
};
</script>

<style>
</style>