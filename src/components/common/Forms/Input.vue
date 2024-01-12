<template>
    <div class="form__control" :class="{ 'form__control--disabled': disabled }">
        <label>
            <span v-if="label" class="form__label">{{ label }}</span>
            <input
                ref="input"
                @input="onInput($event.target.value.trim())"
                @focus="onFocus"
                @blur="onBlur"
                @keypress.enter.prevent
                class="form__input"
                :class="[inputClasses, { 'form__input--unit': unit }]"
                :style="paddingRightStyle"
                :type="type"
                :placeholder="placeholder"
                :disabled="disabled"
                :value="modelValue"
                :min="min"
                :max="max"
            />
            <span v-if="unit" ref="unit" class="form__unit" v-html="unit"></span>
        </label>
        <div v-if="searchable" class="searchable">
            <div v-show="searchableVisible" class="searchable-container">
                <ul>
                    <li
                        v-for="(item, index) in localeOptions"
                        :key="index + 'fuck'"
                        @click="selectItem(item)"
                    >
                        {{ item }}
                    </li>
                </ul>
            </div>
        </div>
        <ValidationInfo v-if="hasValidation && !disabled && !reactive" :validator="v" />
        <ValidationMessage
            v-if="hasValidationError && !disabled"
            :message="v.$errors[0].$message"
        />
        <slot />
    </div>
</template>

<script>
import Mixin from './mixins.js';
import ValidationInfo from '@/components/common/Forms/ValidationInfo.vue';
import ValidationMessage from '@/components/common/Forms/VaildationMessage.vue';

export default {
    name: 'Input',
    components: { ValidationMessage, ValidationInfo },
    mixins: [Mixin],
    props: {
        modelValue: {
            type: [String, Number],
            default: ''
        },
        required: {
            type: Boolean,
            default: false
        },
        v: {
            type: Object,
            default: null
        },
        type: {
            type: String,
            default: 'text'
        },
        label: {
            type: String,
            default: null
        },
        placeholder: {
            type: String,
            default: ''
        },
        searchable: {
            type: Boolean,
            default: false
        },
        options: {
            type: [Array, Object],
            default: () => []
        },
        min: {
            type: [String, Number]
        },
        max: {
            type: [String, Number]
        },
        unit: {
            type: String,
            default: null
        },
        reactive: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            searchableVisible: false,
            localeOptions: this.options
        };
    },
    computed: {
        paddingRightStyle() {
            // Расчет ширины блока с единицой измерения
            if (this.unit) {
                let unitWidth = this.unit.replaceAll('/', '').replaceAll('<sup>', '').length * 10;
                let validationWidth = this.v && this.v.$dirty ? 20 : 0;
                return `padding-right: ${unitWidth + 20 + validationWidth}px`;
            }

            return null;
        }
    },
    watch: {
        options() {
            this.localeOptions = this.options;
        }
    },
    methods: {
        onInput(value) {
            if (value !== this.modelValue) {
                this.validate();
                this.$emit('update:modelValue', value);
                this.search(value);
            }
        },
        search(value) {
            if (!this.searchable) return;

            this.searchableVisible = true;
            this.localeOptions = [];
            this.options.map(item => {
                if (item.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                    this.localeOptions.push(item);
                }
            });
        },
        onFocus() {
            if (this.searchable) this.searchableVisible = true;
        },
        close(e) {
            if (!this.$el.contains(e.target)) this.searchableVisible = false;
        },
        selectItem(item) {
            this.onInput(item);
            this.searchableVisible = false;
        }
    },
    mounted() {
        if (this.searchable) {
            document.addEventListener('click', this.close);
        }

        if (this.reactive) this.validate();
    },
    beforeUnmount() {
        if (this.searchable) {
            document.removeEventListener('click', this.close);
        }
    }
};
</script>

<style></style>
