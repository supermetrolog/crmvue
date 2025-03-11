<template>
    <div class="w-100 d-flex">
        <RadioOptions
            v-if="!disabled"
            v-model="conditionModelValue"
            :v="v$.form"
            required
            :options
        />
    </div>
</template>
<script setup>
import { onBeforeMount, watch } from 'vue';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';

const conditionModelValue = defineModel('condition');
const emit = defineEmits(['set-as-disabled', 'toggle-delete', 'change-hidden']);
const props = defineProps({
    disabled: Boolean,
    hidden: Boolean
});

const options = {
    0: 'Те - что уже описаны',
    1: 'Добавить/редактировать площади'
};

watch(conditionModelValue, value => {
    if (value && props.hidden) emit('change-hidden');
    if (!value && !props.hidden) emit('change-hidden');
});

watch(
    () => props.disabled,
    value => {
        if (value) {
            conditionModelValue.value = null;
        }
    }
);

const v$ = useVuelidate(
    {
        form: {
            required: helpers.withMessage('Выберите вариант', required)
        }
    },
    { form: conditionModelValue }
);

onBeforeMount(() => {
    if (!props.hidden) emit('change-hidden');
});
</script>
