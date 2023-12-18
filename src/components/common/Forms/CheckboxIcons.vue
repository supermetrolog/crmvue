<template>
    <div class="form-item checkbox icons">
        <label class="form-item-label" :class="{ required: required }" for="fuck">
            <span v-if="label">{{ label }}</span>
            <div
                v-if="extraLabel"
                @click="clickExtraLabel"
                class="extra-label"
                :class="{
                    active: isAllSelected || extraLabelSelected || extraOptions.find(item => item == extraValue)
                }"
            >
                <p>{{ extraLabel }}</p>
            </div>
            <div v-if="options.length" class="item-container">
                <label
                    v-for="option in options"
                    :key="option[0]"
                    class="checkbox__label"
                    :class="{
                        active: field.includes(option[0])
                    }"
                    :title="option[1].name"
                >
                    <input
                        v-model="field"
                        @change.stop="onChange"
                        type="checkbox"
                        :class="inputClasses"
                        :value="option[0]"
                    />
                    <i :class="option[1].icon" />
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
        </label>
        <div v-if="v && v.$error" class="error-container">
            <p>{{ v.$errors[0].$message }}</p>
        </div>
    </div>
</template>

<script>
import Mixin from './mixins.js';

export default {
    name: 'CheckboxIcons',
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
            type: Array,
            default: () => []
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
                options.push(item[0]);
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
                options.push(item[0]);
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