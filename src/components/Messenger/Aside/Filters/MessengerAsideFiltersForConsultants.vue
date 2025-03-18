<template>
    <UiForm>
        <UiFormGroup>
            <p class="form__block col-12">Показывать сотрудников</p>
            <SwitchSlider
                v-model="userStatus"
                class="col-12"
                label="Статус"
                unknown-title="Все"
                true-title="Только активные"
                false-title="Только архивные"
            />
        </UiFormGroup>
    </UiForm>
</template>
<script setup>
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import { computed } from 'vue';
import SwitchSlider from '@/components/common/Forms/SwitchSlider.vue';
import { userOptions } from '@/const/options/user.options.js';
import UiForm from '@/components/common/Forms/UiForm.vue';

const modelValue = defineModel();

const userStatus = computed({
    get() {
        if (modelValue.value?.status === userOptions.statusStatement.ACTIVE) return true;
        if (modelValue.value?.status === userOptions.statusStatement.INACTIVE) return false;
        return null;
    },
    set(value) {
        if (value === null) modelValue.value.status = null;
        else modelValue.value.status = value ? 10 : 9;
    }
});
</script>
