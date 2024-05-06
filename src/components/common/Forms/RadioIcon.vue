<template>
    <label class="form__radio-icon radio-icon" :class="{ active: isActive }">
        <input
            v-model="field"
            @click="onChange"
            type="radio"
            class="radio-icon__input"
            :value="value"
        />
        <i class="radio-icon__icon" :class="icon"></i>
        <span class="radio-icon__label">{{ label }}</span>
    </label>
</template>

<script>
import Mixin from './mixins.js';

export default {
    name: 'RadioIcon',
    mixins: [Mixin],
    props: {
        modelValue: {
            type: [Array, Number, String],
            default: 0
        },
        required: {
            type: Boolean,
            default: false
        },
        label: {
            type: String,
            default: null
        },
        value: {
            type: [String, Number, Boolean, null],
            default: null
        },
        unselect: {
            type: Boolean,
            default: false
        },
        icon: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            field: this.modelValue
        };
    },
    computed: {
        isActive() {
            return this.modelValue == this.value;
        }
    },
    watch: {
        modelValue() {
            this.field = this.modelValue;
        }
    },
    methods: {
        onChange() {
            if (this.unselect && this.value == this.field) {
                this.field = null;
            } else {
                this.field = this.value;
            }
            this.$emit('update:modelValue', this.field);
        }
    }
};
</script>

<style></style>
