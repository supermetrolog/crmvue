<template>
    <UiModal
        @close="$emit('close')"
        custom-close
        show
        relative
        :width="550"
        small
        title="Изменение дат"
    >
        <Loader v-if="loading" small />
        <UiForm>
            <UiFormGroup>
                <UiDateInput
                    v-model="form.start"
                    :v="v$.start"
                    label="Дата исполнения"
                    placeholder="Выберите дату.."
                    class="col-6"
                    presets-label="Отложить на"
                    required
                />
                <UiDateInput
                    v-model="form.end"
                    :v="v$.end"
                    label="Дата истечения"
                    placeholder="Выберите дату.."
                    class="col-6"
                    :min-date="form.start"
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

<script setup>
import { reactive, toRef } from 'vue';
import { helpers, minValue, required } from '@vuelidate/validators';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiDateInput from '@/components/common/Forms/UiDateInput.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import { useValidation } from '@/composables/useValidation.js';
import Loader from '@/components/common/Loader.vue';
import { dayjsFromServer, toServerDate } from '@/utils/formatters/date.ts';

const emit = defineEmits(['confirm', 'close']);

const props = defineProps({
    loading: Boolean,
    startDate: String,
    endDate: String
});

function prepareDate(date) {
    return date ? dayjsFromServer(date).toDate() : null;
}

const form = reactive({
    start: prepareDate(props.startDate),
    end: prepareDate(props.endDate)
});

const { v$, validate } = useValidation(
    {
        start: {
            required: helpers.withMessage('Укажите дату исполнения задачи', required)
        },
        end: {
            minValue: helpers.withMessage(
                'Дата начала задачи должна быть раньше даты истечения',
                minValue(toRef(() => form.start))
            )
        }
    },
    form
);

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    emit('confirm', {
        start: toServerDate(form.start),
        end: toServerDate(form.end)
    });
}
</script>
