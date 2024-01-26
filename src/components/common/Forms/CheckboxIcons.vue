<template>
    <div class="checkbox-icons">
        <div class="checkbox-icons__body" :class="{ required: required }">
            <span v-if="label" class="checkbox-icons__title">{{ label }}</span>
            <div
                v-if="extraLabel"
                @click="clickExtraLabel"
                class="checkbox-icons__extra-label"
                :class="{
                    active:
                        isAllSelected ||
                        extraLabelSelected ||
                        extraOptions.find(item => item == extraValue)
                }"
            >
                <p>{{ extraLabel }}</p>
            </div>
            <div v-if="options" class="checkbox-icons__list">
                <label
                    v-for="option in options"
                    :key="option.id"
                    v-tippy="option.name"
                    class="checkbox-icons__label"
                    :class="{
                        active: field.includes(option.id)
                    }"
                >
                    <input
                        v-model="field"
                        @change.stop="onChange"
                        type="checkbox"
                        class="checkbox-icons__input"
                        :class="inputClasses"
                        :value="option.id"
                    />
                    <i class="checkbox-icons__icon" :class="option.icon" />
                </label>
            </div>
            <div v-else>
                <input
                    v-model="field"
                    @change.stop="onChange"
                    type="checkbox"
                    :class="inputClasses"
                    :true-value="1"
                    :false-value="0"
                />
            </div>
        </div>
        <ValidationMessage
            v-if="hasValidationError && !disabled"
            :message="v.$errors[0].$message"
        />
    </div>
</template>

<script>
import Mixin from './mixins.js';
import ValidationMessage from '@/components/common/Forms/VaildationMessage.vue';

export default {
    name: 'CheckboxIcons',
    components: { ValidationMessage },
    mixins: [Mixin],
    props: {
        modelValue: {
            type: [Array, Number],
            default: () => []
        },
        extraOptions: {
            type: Array,
            default: () => []
        },
        extraValue: {
            type: Number
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
        extraLabel: {
            type: String,
            default: null
        },
        options: {
            type: Object,
            default: null
        },
        name: {
            type: String,
            default: null
        },
        noAllSelect: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            field: this.modelValue,
            extraLabelSelected: false
        };
    },
    computed: {
        isAllSelected() {
            return this.compare();
        }
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
        compare() {
            let data = [];
            this.field.forEach(item => {
                data.push(item);
            });
            let options = [];
            this.options.forEach(item => {
                options.push(item.id);
            });
            let result = this.includesArray(options, data);
            return result;
        },
        includesArray(a1, a2) {
            let result = a1.filter(function (i) {
                return !(a2.indexOf(i) > -1);
            });
            return !result.length;
        },
        diff() {
            let options = [];
            this.options.forEach(item => {
                options.push(item.id);
            });
            let data = [];
            this.field.forEach(item => {
                if (!options.includes(item)) {
                    data.push(item);
                }
            });
            this.field = data;
        },
        clickExtraLabel() {
            if (this.noAllSelect) {
                this.extraLabelSelected = !this.extraOptions.find(item => item == this.extraValue);
                this.$emit('extraSelect', this.extraLabelSelected, this.extraValue);
                return;
            }
            if (this.isAllSelected) {
                this.diff();

                return this.onChange();
            }
            this.diff();

            this.options.forEach(item => {
                this.field.push(item[0]);
            });
            return this.onChange();
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
