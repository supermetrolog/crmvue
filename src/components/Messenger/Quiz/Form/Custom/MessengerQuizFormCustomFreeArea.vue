<template>
    <div class="w-100 d-flex">
        <RadioChip
            v-if="disabled"
            v-model="deleteModelValue"
            label="Убрать все текущие площади"
            :value="true"
            unselect
        />
        <RadioOptions v-else v-model="conditionModelValue" :v="v$.form" required :options />
    </div>
</template>
<script setup>
import { onBeforeMount, watch } from 'vue';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import RadioChip from '@/components/common/Forms/RadioChip.vue';

const deleteModelValue = defineModel('delete');
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
            deleteModelValue.value = false;
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
