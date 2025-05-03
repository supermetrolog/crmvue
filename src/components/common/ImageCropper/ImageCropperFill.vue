<template>
    <UiForm>
        <UiFormGroup>
            <UiCol :cols="12">
                <UiInput
                    v-model="modelValue"
                    label="Заливка"
                    type="color"
                    class="image-cropper__color"
                />
            </UiCol>
            <UiCol :cols="12">
                <UiButton
                    @click="modelValue = undefined"
                    :disabled="modelValue === undefined"
                    small
                    color="light"
                    icon="fa-solid fa-close"
                    class="w-100 mb-2"
                    center
                >
                    Без заливки
                </UiButton>
            </UiCol>
        </UiFormGroup>
        <AnimationTransition :speed="0.4">
            <div v-if="preview">
                <UiFormDivider />
                <UiFormGroup>
                    <UiCol :cols="12">
                        <p class="form__label">Предпросмотр</p>
                        <img
                            class="image-cropper__preview"
                            alt="fill logo preview"
                            :src="preview"
                        />
                    </UiCol>
                </UiFormGroup>
            </div>
        </AnimationTransition>
    </UiForm>
</template>
<script setup>
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

const modelValue = defineModel();

defineProps({
    preview: String
});
</script>
