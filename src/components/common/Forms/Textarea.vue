<template>
    <div class="form__control">
        <label class="form__label" :class="{ required: required }">
            <span v-if="label">{{ label }}</span>
            <textarea
                @input="onInput"
                class="form__textarea"
                :class="inputClasses"
                :type="type"
                :placeholder="placeholder"
                :value="modelValue"
            />
        </label>
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
    name: 'Textarea',
    components: { ValidationMessage },
    mixins: [Mixin],
    props: {
        modelValue: {
            type: String,
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
        }
        // maska: {
        //   default: null,
        // },
    },
    methods: {
        onInput($event) {
            this.validate();
            this.$emit('update:modelValue', $event.target.value.trim());
        }
    }
};
</script>

<style></style>
