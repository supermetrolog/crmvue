<template>
    <div class="form__control">
        <label :class="{ required: required }">
            <span v-if="label" class="form__label">{{ label }}</span>
            <textarea
                ref="textarea"
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
import { watch } from 'vue';

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
        },
        autoHeight: {
            type: Boolean,
            default: false
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
    },
    created() {
        if (this.autoHeight) {
            watch(
                () => this.modelValue,
                async () => {
                    this.$refs.textarea.style.height = 'auto';

                    await this.$nextTick();
                    this.$refs.textarea.style.height = this.$refs.textarea.scrollHeight + 'px';
                }
            );
        }
    }
};
</script>

<style></style>
