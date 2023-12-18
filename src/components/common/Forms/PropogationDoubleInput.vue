<template>
    <div class="form-item propogation-input phones">
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
                    class="main-input mb-1"
                    :placeholder="placeholder"
                />
                <input
                    v-model="field[index][name2]"
                    @input.stop.prevent="onInput"
                    @keypress.enter.prevent
                    type="text"
                    :class="inputClasses"
                    class="additional-input mb-1"
                    :title="title2"
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
    name: 'PropogationDoubleInput',
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
            default: 'phone'
        },
        name2: {
            type: String,
            required: true,
            default: 'exten'
        },
        title2: {
            type: String,
            default: 'Добавочный номер'
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
            let data = {};

            this.field.map(item => {
                if (item[this.name].length) {
                    data = { ...item, [this.name]: item[this.name], [this.name2]: null };
                    if (item[this.name2] !== null && item[this.name2].length) {
                        data[this.name2] = item[this.name2];
                    }
                    array.push(data);
                }
            });
            if (this.field.length == 1) {
                this.field = array;
            }

            this.$emit('update:modelValue', array);
        },
        deleteInput(index) {
            this.field = this.field.filter((_, idx) => idx != index);
            this.$emit('update:modelValue', this.field);
        },
        addInput(item, index) {
            if (item && item[this.name].length && typeof this.field[index + 1] == 'undefined') {
                this.field.push({ [this.name]: '', [this.name2]: null });
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.$refs['input' + (index + 1)][0].focus();
                    }, 500);
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
            return [{ [this.name]: '', [this.name2]: null }];
        }
    },
    mounted() {
        this.setData();
    }
};
</script>

<style></style>