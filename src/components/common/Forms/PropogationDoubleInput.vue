<template>
    <div class="form__control propogation-input">
        <span class="form__label">{{ label }}</span>
        <div v-for="(item, index) in field" :key="index" class="form__control">
            <label
                @mouseenter="isDeleteShowList[index] = true"
                @mouseleave="isDeleteShowList[index] = false"
                class="form__label form__label--row"
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
                    v-model="field[index][firstName]"
                    v-maska="maska"
                    @input.stop.prevent="onInput"
                    @keypress.enter.prevent
                    type="text"
                    class="form__input"
                    :class="{
                        invalid: errors[index].length && field[index][firstName].length,
                        valid: !errors[index].length && field[index][firstName].length
                    }"
                    :placeholder="placeholder"
                />
                <input
                    v-model="field[index][secondName]"
                    @input.stop.prevent="onInput"
                    @keypress.enter.prevent
                    type="text"
                    :class="{
                        invalid: errors[index].length && field[index][firstName].length,
                        valid: !errors[index].length && field[index][firstName].length
                    }"
                    class="form__input form__input--additional"
                    :title="title2"
                />
            </label>
            <ValidationMessage v-if="errors[index].length" :message="errors[index][0]" />
        </div>
        <ValidationMessage
            v-if="hasValidationError && !disabled"
            :message="v.$errors[0].$message"
        />
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
import ValidationMessage from '@/components/common/Forms/VaildationMessage.vue';

export default {
    name: 'PropogationDoubleInput',
    components: { ValidationMessage, AnimationTransition, Button },
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
        maska: {
            default: null
        },
        placeholder: {
            type: String
        },
        firstName: {
            type: String,
            default: 'phone'
        },
        secondName: {
            type: String,
            default: 'exten'
        },
        title2: {
            type: String,
            default: 'Добавочный номер'
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
            return this.field.filter(item => !item[this.firstName].length).length;
        },
        errors() {
            return this.field.map(field => {
                return this.validators.reduce(
                    (acc, validator) =>
                        !validator.func(field[this.firstName]) && field[this.firstName].length
                            ? [...acc, validator.message]
                            : acc,
                    []
                );
            });
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
                this.field.push({ [this.firstName]: '', [this.secondName]: null });
                this.$nextTick(() => {
                    this.$refs['input-' + (this.field.length - 1)][0].focus();
                });
            }
        }
    },
    created() {
        if (!this.modelValue.length)
            this.field = [{ [this.firstName]: '', [this.secondName]: null }];
        else this.field = this.modelValue;
    }
};
</script>

<style></style>
