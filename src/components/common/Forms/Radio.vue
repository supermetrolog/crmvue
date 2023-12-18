<template>
    <div class="form-item radio" :class="mode">
        <label class="form-item-label" :class="{ required: required }" for="fuck">
            <p v-if="label">
                {{ label }}
            </p>
            <div v-if="options.length">
                <label
                    v-for="option in options"
                    :key="option[0]"
                    :class="{
                        checked: mode == 'text' && field == option[0]
                    }"
                >
                    <input
                        v-model="field"
                        @click="onChange($event)"
                        type="radio"
                        :class="inputClasses"
                        :value="option[0]"
                    />
                    {{ option[1] }}
                </label>
            </div>
            <div v-else>
                <input v-model="field" type="radio" :class="inputClasses" :value="1" />
            </div>
        </label>
        <div v-if="v && v.$error" class="error-container">
            <p>{{ v.$errors[0].$message }}</p>
        </div>
        <slot />
    </div>
</template>

<script>
import Mixin from './mixins.js';

export default {
    name: 'Radio',
    mixins: [Mixin],
    props: {
        modelValue: {
            type: [Array, Number, String],
            default: () => []
        },
        required: {
            type: Boolean,
            default: false
        },
        mode: {
            type: String,
            default: ''
        },
        v: {
            type: Object,
            default: null
        },
        label: {
            type: String,
            default: null
        },
        options: {
            type: Array,
            default: () => []
        },
        unselectMode: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            field: this.modelValue
        };
    },
    watch: {
        // field() {
        //   this.onChange();
        // },
        modelValue() {
            this.field = this.modelValue;
        }
    },
    methods: {
        onChange(event) {
            this.validate();
            const value = event.target.value;
            if (this.unselectMode && value == this.field) {
                this.field = null;
            } else {
                this.field = +value;
            }
            this.$emit('update:modelValue', this.field);
        }
    }
};
</script>

<style></style>