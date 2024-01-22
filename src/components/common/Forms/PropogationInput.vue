<template>
    <div class="form__group propogation-input">
        <span class="form__label">{{ label }}</span>
        <div v-for="(item, index) in field" :key="index" class="form__control">
            <label
                @mouseenter="isDeleteShowList[index] = true"
                @mouseleave="isDeleteShowList[index] = false"
                class="form__label"
                :class="{ required: required }"
            >
                <AnimationTransition>
                    <i
                        v-show="isDeleteShowList[index]"
                        @click="deleteInput(index)"
                        class="form__close fas fa-xmark-circle"
                    ></i>
                </AnimationTransition>
                <input
                    :ref="'input-' + index"
                    v-model="field[index][this.propertyName]"
                    v-maska="maska"
                    @input.stop.prevent="onInput"
                    @keypress.enter.prevent
                    type="text"
                    class="form__input"
                    :required="required"
                    :placeholder="placeholder"
                    :class="{
                        invalid: isValid(index),
                        valid: !isValid(index)
                    }"
                />
            </label>
            <ValidationMessage v-if="errors[index].length" :message="errors[index][0]" />
        </div>
        <ValidationMessage
            v-if="hasValidationError && !disabled"
            :message="v.$errors[0].$message"
        />
        <Button @click="addInput" :disabled="hasEmptyInput" prevent icon small success class="mt-1">
            <i class="fas fa-plus"></i>
            {{ addText }}
        </Button>
    </div>
</template>

<script>
import Mixin from './mixins.js';
import Button from '@/components/common/Button.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import ValidationMessage from '@/components/common/Forms/VaildationMessage.vue';

export default {
    name: 'PropogationInput',
    components: { ValidationMessage, AnimationTransition, Button },
    mixins: [Mixin],
    props: {
        modelValue: {
            type: Array,
            default: () => this.createDefaultField()
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
        maska: {
            default: null
        },
        placeholder: {
            type: String
        },
        propertyName: {
            type: String,
            required: true
        },
        addText: {
            type: String,
            default: 'Добавить поле'
        },
        validators: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            field: null,
            isDeleteShowList: [false]
        };
    },
    computed: {
        hasEmptyInput() {
            return this.field.filter(item => !item[this.propertyName].length).length;
        },
        errors() {
            return this.field.map(field => {
                return this.validators.reduce(
                    (acc, validator) =>
                        !validator.func(field[this.propertyName]) && field[this.propertyName].length
                            ? [...acc, validator.message]
                            : acc,
                    []
                );
            });
        }
    },
    watch: {
        modelValue() {
            if (!this.modelValue.length) this.field = [this.createDefaultField()];
            else this.field = this.modelValue;
        }
    },
    methods: {
        onInput() {
            this.validate();
            this.$emit('update:modelValue', this.field);
        },
        deleteInput(index) {
            if (this.field.length === 1) return;
            this.field = this.field.filter((_, idx) => idx != index);
            this.$emit('update:modelValue', this.field);
        },
        addInput() {
            if (!this.hasEmptyInput) {
                this.field.push(this.createDefaultField());
                this.$nextTick(() => {
                    this.$refs['input-' + (this.field.length - 1)][0].focus();
                });
            }
        },
        isValid(index) {
            return this.errors[index].length && this.field[index][this.propertyName].length;
        },
        createDefaultField() {
            return { [this.propertyName]: '' };
        }
    },
    created() {
        if (!this.modelValue.length) this.field = [this.createDefaultField()];
        else this.field = this.modelValue;
    }
};
</script>

<style></style>
