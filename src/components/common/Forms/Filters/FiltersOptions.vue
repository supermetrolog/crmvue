<template>
    <div class="filters__options">
        <template v-if="category.multiple">
            <CheckboxChip
                v-for="(option, key) in category.options"
                :key="key"
                v-model="value"
                :value="option.value"
                :text="option.text"
                class="filters__option"
            />
        </template>
        <template v-else>
            <RadioChip
                v-for="(option, key) in category.options"
                :key="key"
                v-model="value"
                :value="option.value"
                :label="option.text"
                unselect
                class="filters__option"
            />
        </template>
    </div>
</template>
<script>
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';

export default {
    name: 'FiltersOptions',
    components: { RadioChip, CheckboxChip },
    emits: ['update:modelValue'],
    props: {
        category: {
            type: Object,
            required: true
        },
        modelValue: {
            type: Object,
            default: () => null
        }
    },
    computed: {
        value: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit('update:modelValue', value);
            }
        }
    }
};
</script>
