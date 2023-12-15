<template>
    <div class="form-item textarea">
        <label class="form-item-label" :class="{ required: required }">
            <p v-if="label">
                {{ label }}
            </p>
            <textarea
                @input="onInput"
                class="form__textarea"
                :class="inputClasses"
                :type="type"
                :placeholder="placeholder"
                :value="modelValue"
            />
        </label>
        <div v-if="v && v.$error" class="error-container">
            <p>{{ v.$errors[0].$message }}</p>
        </div>
    </div>
</template>

<script>
import Mixin from './mixins.js';

export default {
    name: 'Textarea',
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