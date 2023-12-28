<template>
    <div class="form__control">
        <label class="form__label form__stars" :class="{ required: required }">
            <span v-if="label">{{ label }}</span>
            <span v-if="options">
                <label v-for="(option, key) in options" :key="key">
                    <i
                        class="far fa-star form__star"
                        :class="{ 'text-warning fas fa-star': field >= key }"
                    ></i>
                    <input
                        v-model="field"
                        type="radio"
                        class="d-none"
                        :class="inputClasses"
                        :value="key"
                    />
                    {{ option.name }}
                </label>
            </span>
            <template v-else>
                <input v-model="field" type="radio" :class="inputClasses" :value="1" />
            </template>
        </label>
        <div v-if="v && v.$error" class="error-container">
            <p>{{ v.$errors[0].$message }}</p>
        </div>
        <slot />
    </div>
</template>

<script>
import Mixin from './mixins.js';

export default {
    name: 'RadioStars',
    mixins: [Mixin],
    props: {
        modelValue: {
            type: [Array, Number],
            default: () => []
        },
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
        options: {
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
        field() {
            this.onChange();
        },
        modelValue() {
            this.field = this.modelValue;
        }
    },
    methods: {
        onChange() {
            this.validate();
            this.$emit('update:modelValue', this.field);
        }
    }
};
</script>
