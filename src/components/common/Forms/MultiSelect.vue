<template>
    <div class="form__control">
        <label for="" class="form__label" :class="{ required: required }">
            <span v-if="label">
                {{ label }}
            </span>
            <Multiselect
                ref="multiselect"
                v-model="field"
                @change="onChange($event)"
                :class="[inputClasses, extraClasses]"
                :placeholder="placeholder"
                :mode="mode"
                :options="options"
                :closeOnSelect="closeOnSelect"
                :searchable="searchable"
                :createTag="createTag"
                :canDeselect="canDeselect"
                :filterResults="filterResults"
                :minChars="minChars"
                :resolveOnLoad="resolveOnLoad"
                :delay="delay"
                :loading="loading"
                :multipleLabel="multipleLabel"
                :disabled="disabled"
                :hideSelected="hideSelected"
                :groups="groups"
            >
                <template #singlelabel="{ value }">
                    <slot name="singlelabel" :value="value" />
                </template>
                <template #option="{ option }">
                    <slot name="option" :option="option" />
                </template>
            </Multiselect>
        </label>
        <div v-if="v && v.$error" class="error-container">
            <p>{{ v.$errors[0].$message }}</p>
        </div>
        <slot />
    </div>
</template>

<script>
import Multiselect from '@vueform/multiselect';
import Mixin from './mixins.js';

export default {
    name: 'Select',
    components: {
        Multiselect
    },
    mixins: [Mixin],
    props: {
        modelValue: {
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
        label: {
            type: String,
            default: null
        },
        placeholder: {
            type: String,
            default: ''
        },
        options: {
            required: true
        },
        settings: {
            type: Object
        },
        mode: {
            type: String,
            default: 'single'
        },
        closeOnSelect: {
            type: Boolean,
            default: true
        },
        clearOnSelect: {
            type: Boolean,
            default: false
        },
        searchable: {
            type: Boolean,
            default: false
        },
        createTag: {
            type: Boolean,
            default: false
        },
        canDeselect: {
            type: Boolean,
            default: false
        },
        filterResults: {
            type: Boolean,
            default: true
        },
        minChars: {
            type: Number,
            default: 1
        },
        resolveOnLoad: {
            type: Boolean,
            default: true
        },
        delay: {
            type: Number,
            default: 0
        },
        extraClasses: {
            type: String,
            default: ''
        },
        loading: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            default: null
        },
        disabled: {
            type: Boolean,
            default: false
        },
        hideSelected: {
            type: Boolean,
            default: false
        },
        groups: {
            type: Boolean,
            default: false
        },
        multipleLabel: {
            type: Function,
            default: n => {
                return `выбрано => ${n.length}`;
            }
        }
    },
    data() {
        return {
            field: this.modelValue,
            localeSettings: {
                canDeselect: false,
                ...this.settings
            }
        };
    },
    watch: {
        modelValue() {
            if (this.name) {
                this.setData();
            } else {
                this.field = this.modelValue;
            }
        }
    },
    methods: {
        onChange(value) {
            this.field = value;

            this.validate();
            if (this.name) {
                let array = [];
                this.field.forEach(item => {
                    array.push({ [this.name]: item });
                });
                this.$emit('update:modelValue', array);
                this.$emit('change', array);
            } else {
                this.$emit('update:modelValue', this.field);
                this.$emit('change', this.field);
            }
        },
        setData() {
            this.field = [];
            this.modelValue.forEach(item => {
                this.field.push(item[this.name]);
            });
        }
    },
    mounted() {
        if (this.name) {
            this.setData();
        }
    }
};
</script>

<style></style>