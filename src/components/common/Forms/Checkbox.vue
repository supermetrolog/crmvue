<template>
    <div class="form-item checkbox" :class="mode">
        <label class="form-item-label" :class="{ required: required }" for="fuck">
            <p v-if="mode == '' && label">
                {{ mode == '' ? label : '' }}
            </p>
            <div v-if="options">
                <label
                    v-for="(option, index) in options"
                    :key="index"
                    class="clicked-label"
                    :class="{ checked: field.includes(index) }"
                >
                    <input
                        v-model="field"
                        @change.stop="onChange"
                        type="checkbox"
                        :class="inputClasses"
                        :value="index"
                        :disabled="disabled"
                    />
                    {{ option }}
                </label>
            </div>
            <div v-else>
                <input
                    v-model="field"
                    @change.stop="onChange"
                    type="checkbox"
                    :class="inputClasses"
                    :true-value="trueValue"
                    :false-value="falseValue"
                    :disabled="disabled"
                />
                {{ mode == 'inline' ? label : '' }}
            </div>
        </label>
        <div v-if="v && v.$error" class="error-container pt-0">
            <p>{{ v.$errors[0].$message }}</p>
        </div>
        <slot />
    </div>
</template>

<script>
import Mixin from './mixins.js';

export default {
    name: 'Checkbox',
    mixins: [Mixin],
    props: {
        modelValue: {
            type: [Array, Number, String],
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
        mode: {
            type: String,
            default: ''
        },
        options: {
            type: Object,
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
        trueValue: {
            type: [Number, String, Object],
            default: 1
        },
        falseValue: {
            type: [Number, String, Object],
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
            if (this.name) {
                this.setData();
            } else {
                this.field = this.modelValue;
            }
        }
    },
    methods: {
        onChange() {
            this.validate();
            if (this.name) {
                let array = [];
                this.field.forEach(item => {
                    array.push({ [this.name]: item });
                });
                this.$emit('update:modelValue', array);
                this.$emit('change', this.field);
            } else {
                this.$emit('update:modelValue', this.field);
                this.$emit('change', this.field);
            }
        },
        setData() {
            this.field = [];
            this.modelValue.forEach(item => {
                this.field.push(item[this.name]);
            });
        }
    },
    mounted() {
        if (this.name) {
            this.setData();
        }
    }
};
</script>

<style></style>
