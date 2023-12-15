<template>
    <div class="form-item propogation-input">
        <label class="form-item-label" :class="{ required: required }">
            <p v-if="label">
                {{ label }}
            </p>
            <div v-for="(item, index) in field" :key="index" class="item-container">
                <i @click="deleteInput(index)" class="fas fa-minus delete"></i>

                <i @click="addInput(item, index)" class="fas fa-plus add"></i>

                <input
                    :ref="'input' + index"
                    v-model="field[index][name]"
                    @input.stop.prevent="onInput"
                    @keypress.enter.prevent
                    type="text"
                    :class="inputClasses"
                    class="mb-1"
                    :placeholder="placeholder"
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
    name: 'PropogationInput',
    mixins: [Mixin],
    props: {
        modelValue: {
            type: Array,
            default: () => this.defaultField()
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
        // maska: {
        //   default: null,
        // },
        placeholder: {
            type: String
        },
        name: {
            type: String,
            required: true,
            default: 'fuck'
        }
    },
    data() {
        return {
            field: null
        };
    },
    watch: {
        modelValue() {
            this.setData();
        }
    },
    methods: {
        onInput() {
            this.validate();
            const array = [];
            this.field.map(item => {
                if (item[this.name].length) {
                    array.push(item);
                }
            });
            if (this.field.length == 1) {
                this.field = array;
            }
            this.$emit('update:modelValue', this.field);
        },
        deleteInput(index) {
            this.field = this.field.filter((_, idx) => idx != index);
            this.$emit('update:modelValue', this.field);
        },
        addInput(item, index) {
            if (item && item[this.name].length && typeof this.field[index + 1] == 'undefined') {
                this.field.push({ [this.name]: '' });
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.$refs['input' + (index + 1)][0].focus();
                    }, 0);
                });
            }
        },
        setData() {
            if (!this.modelValue.length) {
                this.field = this.defaultField();
            } else {
                this.field = this.modelValue;
            }
        },
        defaultField() {
            return [{ [this.name]: '' }];
        }
    },
    mounted() {
        this.setData();
    }
};
</script>

<style></style>