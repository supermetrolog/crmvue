<template>
    <div class="form__control propogation-input">
        <span class="form__label">{{ label }}</span>
        <label
            v-for="(item, index) in field"
            :key="index"
            @mouseenter="isDeleteShow = true"
            @mouseleave="isDeleteShow = false"
            class="form__label"
            :class="{ required: required }"
        >
            <AnimationTransition>
                <i
                    v-show="isDeleteShow"
                    @click="deleteInput(index)"
                    class="form__close fas fa-xmark-circle"
                ></i>
            </AnimationTransition>
            <input
                :ref="'input-' + index"
                v-model="field[index][name]"
                @input.stop.prevent="onInput"
                @keypress.enter.prevent
                type="text"
                class="form__input"
                :class="inputClasses"
                :placeholder="placeholder"
            />
        </label>
        <div v-if="v && v.$error" class="error-container">
            <p>{{ v.$errors[0].$message }}</p>
        </div>
        <Button @click="addInput" prevent icon small success class="mt-1">
            <i class="fas fa-plus"></i>
            {{ addText }}
        </Button>
    </div>
</template>

<script>
import Mixin from './mixins.js';
import Button from '@/components/common/Button.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

export default {
    name: 'PropogationInput',
    components: { AnimationTransition, Button },
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
        },
        addText: {
            type: String,
            default: 'Добавить поле'
        }
    },
    data() {
        return {
            field: null,
            isDeleteShow: false
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
            if (this.field.length === 1) return;
            this.field = this.field.filter((_, idx) => idx != index);
            this.$emit('update:modelValue', this.field);
        },
        addInput() {
            const countEmptyInputs = this.field.filter(
                element => element[this.name].length === 0
            ).length;

            if (!countEmptyInputs) {
                this.field.push({ [this.name]: '' });
                this.$nextTick(() => {
                    this.$refs['input-' + (this.field.length - 1)][0].focus();
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
