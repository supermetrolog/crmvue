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
import { computed } from 'vue';
import FormWrapper from '@/components/common/Forms/Form.vue';
import SwitchSlider from '@/components/common/Forms/SwitchSlider.vue';
import { userOptions } from '@/const/options/user.options.js';

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
