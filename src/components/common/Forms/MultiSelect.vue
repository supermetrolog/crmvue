<template>
    <div class="form__control" :class="{ 'form__control--disabled': disabled }">
        <label for="" :class="{ required: required }">
            <span v-if="label" class="form__label">
                {{ label }}
            </span>
            <Multiselect
                ref="multiselect"
                v-model="field"
                @change="onChange($event)"
                class="form__multiselect"
                :class="[inputClasses, extraClasses]"
                :placeholder="placeholder"
                :mode="mode"
                append-to-body
                :options="options"
                :close-on-select="closeOnSelect"
                :searchable="searchable"
                :create-tag="createTag"
                :can-deselect="canDeselect"
                :filterResults="filterResults"
                :min-chars="minChars"
                :resolve-on-load="resolveOnLoad"
                :delay="delay"
                :loading="loading"
                :multiple-label="multipleLabel"
                :disabled="Boolean(disabled)"
                :hide-selected="hideSelected"
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
        <ValidationMessage v-if="hasValidationError" :message="v.$errors[0].$message" />
        <div v-if="multiple && field.length" class="form__chips mt-2">
            <Chip
                v-for="(element, index) in field"
                :key="index"
                @click="removeElement(index)"
                :value="element"
                :html="multipleProperty ? element[multipleProperty] : options[element]"
            />
        </div>
        <slot />
    </div>
</template>

<script>
import Multiselect from '@vueform/multiselect';
import Mixin from './mixins.js';
import Chip from '@/components/common/Chip.vue';
import ValidationMessage from '@/components/common/Forms/VaildationMessage.vue';

export default {
    name: 'Select',
    components: {
        ValidationMessage,
        Chip,
        Multiselect
    },
    mixins: [Mixin],
    props: {
        modelValue: {
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
        },
        multiple: {
            type: Boolean,
            default: false
        },
        multipleProperty: {
            type: String,
            default: null
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
        },
        removeElement(index) {
            this.field.splice(index, 1);
        }
    },
    created() {
        if (this.name) {
            this.setData();
        }
    }
};
</script>

<style></style>
