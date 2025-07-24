<template>
    <UiModal
        @close="$emit('close')"
        custom-close
        show
        relative
        :width="550"
        small
        title="Изменение типа задачи"
    >
        <Loader v-if="loading" small />
        <UiForm>
            <UiFormGroup>
                <MultiSelect
                    v-model="form.type"
                    :v="v$.type"
                    label="Тип задачи"
                    class="col-12"
                    :options="TaskTypeLabel"
                    placeholder="Укажите тип.."
                    required
                />
            </UiFormGroup>
        </UiForm>
        <template #actions="{ close }">
            <UiButton @click="submit"
color="success-light"
icon="fa-solid fa-check"
small
:loading>
                Сохранить
            </UiButton>
            <UiButton @click="close" color="light" icon="fa-solid fa-ban" small>Отмена</UiButton>
        </template>
    </UiModal>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { helpers, required } from '@vuelidate/validators';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import { useValidation } from '@/composables/useValidation.js';
import Loader from '@/components/common/Loader.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import { TaskType, TaskTypeEnum, TaskTypeLabel } from '@/types/task';

const emit = defineEmits(['confirm', 'close']);

const props = defineProps<{ loading?: boolean; type?: TaskType }>();

const form = reactive<{ type: TaskType }>({
    type: props.type ?? TaskTypeEnum.BASE
});

const { v$, validate } = useValidation(
    {
        type: {
            required: helpers.withMessage('Выберите тип задачи', required)
        }
    },
    form
);

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    emit('confirm', { type: form.type });
}
</script>
