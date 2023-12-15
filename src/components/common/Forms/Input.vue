<template>
    <div class="form__control">
        <label for="">
            <span v-if="label" class="form__label">{{ label }}</span>
            <input
                ref="input"
                @input="onInput($event.target.value.trim())"
                @focus="onFocus"
                @blur="onBlur"
                @keypress.enter.prevent
                class="form__input"
                :class="inputClasses"
                :type="type"
                :placeholder="placeholder"
                :disabled="disabled"
                :value="modelValue"
                :min="min"
                :max="max"
            />
        </label>
        <div v-if="searchable" class="searchable">
            <div v-show="searchableVisible" class="searchable-container">
                <ul>
                    <li v-for="(item, index) in localeOptions" :key="index + 'fuck'" @click="selectItem(item)">
                        {{ item }}
                    </li>
                </ul>
            </div>
        </div>
        <div v-if="v && v.$error" class="error-container">
            <p>{{ v.$errors[0].$message }}</p>
        </div>
        <slot />
    </div>
</template>

<script>
import Mixin from './mixins.js';

export default {
    name: 'Input',
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
        disabled: {
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
        }
    },
    data() {
        return {
            searchableVisible: false,
            localeOptions: this.options
        };
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
    },
    beforeUnmount() {
        if (this.searchable) {
            document.removeEventListener('click', this.close);
        }
    }
};
</script>

<style></style>