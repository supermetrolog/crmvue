<template>
    <div class="p-2">
        <p class="mb-2 font-weight-semi">Комментарий по опросу:</p>
        <UiForm>
            <UiFormGroup>
                <VueEditor
                    v-model="modelValue"
                    :v
                    :min-height="150"
                    :max-height="400"
                    :toolbar="false"
                    placeholder="Что выяснили? Какое положение по компании? Опишите ситуацию.."
                    class="col-12"
                />
            </UiFormGroup>
        </UiForm>
    </div>
</template>
<script setup>
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';

defineProps({
    v: Object
});

const modelValue = defineModel();
</script>
