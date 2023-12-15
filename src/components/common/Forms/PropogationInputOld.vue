<template>
    <div class="form-item propogation-input">
        <label v-if="field.length && field.length != 1" class="form-item-label" :class="{ required: required }">
            <p v-if="label">
                {{ label }}
            </p>
            <div v-for="(item, index) in field" :key="index" class="item-container">
                <i @click="deleteInput(index)" class="fas fa-minus delete"></i>
                <i
                    v-if="typeof field[index + 1] == 'undefined'"
                    @click="addInput(item, index)"
                    class="fas fa-plus add"
                ></i>
                <input
                    :ref="'input' + index"
                    v-model.lazy="field[index]"
                    @change="onChange"
                    type="text"
                    :class="inputClasses"
                    class="mb-1"
                    :placeholder="placeholder"
                />
            </div>
        </label>
        <label v-else class="form-item-label" :class="{ required: required }">
            {{ label }}
            <div class="item-container">
                <i @click="addInput(field[0], 0)" class="fas fa-plus add"></i>

                <input
                    :ref="'input' + 0"
                    v-model.lazy="field[0]"
                    @change="onChange"
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
export default {
    name: 'PropogationInput',
    props: {
        modelValue: {
            type: Array,
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
        // maska: {
        //   default: null,
        // },
        placeholder: {
            type: String
        }
    },
    data() {
        return {
            field: this.modelValue
        };
    },
    computed: {
        inputClasses() {
            if (this.v) {
                return {
                    invalid: this.v.$error,
                    valid: this.v.$dirty && !this.v.$error
                };
            }

            return '';
        }
    },
    watch: {
        modelValue() {
            this.field = this.modelValue;
        }
    },
    methods: {
        onChange() {
            this.validate();
            const array = [];
            this.field.map(item => {
                if (item.length) {
                    array.push(item);
                }
            });
            this.field = array;
            this.$emit('update:modelValue', this.field);
        },
        validate() {
            if (this.v) {
                this.v.$touch();
            }
        },
        deleteInput(index) {
            this.field = this.field.filter((_, idx) => idx != index);
            this.$emit('update:modelValue', this.field);
        },
        addInput(item, index) {
            if (item && item.length && typeof this.field[index + 1] == 'undefined') {
                this.field.push('');
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.$refs['input' + (index + 1)].focus();
                    }, 0);
                });
            }
        }
    }
};
</script>

<style></style>