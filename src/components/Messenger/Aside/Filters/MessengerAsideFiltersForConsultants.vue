<template>
    <FormWrapper>
        <FormGroup>
            <p class="form__block col-12">Показывать сотрудников</p>
            <SwitchSlider
                v-model="userStatus"
                class="col-12"
                label="Статус"
                unknown-title="Все"
                true-title="Только активные"
                false-title="Только архивные"
            />
        </FormGroup>
    </FormWrapper>
</template>
<script setup>
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import { computed, onBeforeMount, shallowReactive, watch } from 'vue';
import FormWrapper from '@/components/common/Forms/Form.vue';
import SwitchSlider from '@/components/common/Forms/SwitchSlider.vue';
import { userOptions } from '@/const/options/user.options.js';

const modelValue = defineModel({ type: Array, default: () => [] });

const form = shallowReactive({
    status: null
});

const userStatus = computed({
    get() {
        if (form.status === userOptions.statusStatement.ACTIVE) return true;
        if (form.status === userOptions.statusStatement.INACTIVE) return false;
        return null;
    },
    set(value) {
        if (value === null) form.status = null;
        else form.status = value ? 10 : 9;
    }
});

const formToModelValue = () => {
    return Object.keys(form).reduce((acc, key) => {
        if (form[key] !== null) acc.push({ key, value: form[key] });
        return acc;
    }, []);
};

const modelValueToForm = () => {
    modelValue.value.forEach(element => {
        form[element.key] = element.value;
    });
};

watch(
    form,
    () => {
        modelValue.value = formToModelValue();
    },
    { deep: true }
);

onBeforeMount(() => {
    if (modelValue.value.length) modelValueToForm();
});
</script>
