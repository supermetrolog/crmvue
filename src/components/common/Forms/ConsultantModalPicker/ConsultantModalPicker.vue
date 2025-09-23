<template>
    <div>
        <span v-if="label || $slots.label" class="form__label" :class="{ required }">
            <slot name="label" :label="label">{{ label }}</slot>
        </span>
        <div class="d-flex gap-2 flex-wrap">
            <UiButton
                @click.prevent="pickerIsVisible = true"
                color="success-light"
                icon="fa-solid fa-plus"
                small
            >
                {{ addLabel }}
            </UiButton>
            <ConsultantModalPickerOption
                v-for="value in selectedOptions"
                :key="value.id"
                @remove="removeById(value.id)"
                :option="value"
            />
        </div>
        <ValidationMessage v-if="hasValidationError" :message="v.$errors[0].$message" />
        <teleport to="body">
            <UiModal v-model:visible="pickerIsVisible" title="Выбор сотрудников" :width="1200">
                <UserPicker v-model="modelValue" :users="options">
                    <template v-if="$slots['picker-actions']" #after-search>
                        <slot name="picker-actions" />
                    </template>
                </UserPicker>
                <template #actions="{ close }">
                    <UiButton @click="close" icon="fa-solid fa-ban" color="light">Закрыть</UiButton>
                </template>
            </UiModal>
        </teleport>
    </div>
</template>
<script setup lang="ts">
import { computed, ref, toRef } from 'vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UserPicker from '@/components/common/Forms/UserPicker/UserPicker.vue';
import ConsultantModalPickerOption from '@/components/common/Forms/ConsultantModalPicker/ConsultantModalPickerOption.vue';
import ValidationMessage from '@/components/common/Forms/VaildationMessage.vue';
import { useFormControlValidation } from '@/composables/useFormControlValidation';

const modelValue = defineModel<number[]>({ default: () => [] });

const props = withDefaults(
    defineProps<{
        label?: string;
        addLabel?: string;
        options: object[];
        v?: object;
        required?: boolean;
    }>(),
    {
        label: 'Консультант',
        addLabel: 'Добавить консультанта'
    }
);

const selectedOptions = computed(() =>
    props.options.filter(option => modelValue.value.includes(option.id))
);

// picker

const pickerIsVisible = ref(false);

function removeById(id: number) {
    const index = modelValue.value.findIndex(value => value === id);
    if (index !== -1) {
        modelValue.value!.splice(index, 1);
    }
}

// validation

const { hasValidationError } = useFormControlValidation(toRef(props, 'v'), modelValue);
</script>
