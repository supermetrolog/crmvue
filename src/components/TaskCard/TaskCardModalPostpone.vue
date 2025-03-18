<template>
    <UiModal
        @close="$emit('close')"
        custom-close
        show
        relative
        :width="550"
        small
        title="Отложить задачу"
    >
        <Loader v-if="loading" small />
        <UiForm>
            <UiFormGroup>
                <UiDateInput
                    v-model="newDate"
                    :v="v$.newDate"
                    label="Отложить до"
                    placeholder="Выберите дату.."
                    class="col-12"
                    :min-date="new Date()"
                    :presets="presets"
                    presets-label="Отложить на"
                    required
                />
            </UiFormGroup>
        </UiForm>
        <template #actions="{ close }">
            <UiButton
                @click="submit"
                :disabled="loading || !newDate"
                color="success-light"
                icon="fa-solid fa-check"
                small
                :loading
            >
                Сохранить
            </UiButton>
            <UiButton @click="close" color="light" icon="fa-solid fa-ban" small>Отмена</UiButton>
        </template>
    </UiModal>
</template>

<script setup>
import { ref } from 'vue';
import { helpers, required, minValue } from '@vuelidate/validators';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiDateInput from '@/components/common/Forms/UiDateInput.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import { useValidation } from '@/composables/useValidation.js';
import dayjs from 'dayjs';
import Loader from '@/components/common/Loader.vue';

const emit = defineEmits(['confirm', 'close']);
defineProps({
    loading: Boolean,
    startDate: {
        type: String,
        required: true
    }
});

const newDate = ref(null);

const { v$, validate } = useValidation(
    {
        newDate: {
            required: helpers.withMessage('Укажите, на какую дату перенести задачу!', required),
            minValue: helpers.withMessage('Дата должна быть больше текущей!', minValue(new Date()))
        }
    },
    { newDate }
);

// presets

const presets = [
    {
        value: dayjs().add(1, 'hour').toDate(),
        label: '1 час'
    },
    {
        value: dayjs().add(3, 'hour').toDate(),
        label: '3 часа'
    },
    {
        value: dayjs().add(1, 'day').toDate(),
        label: '1 день'
    },
    {
        value: dayjs().add(3, 'day').toDate(),
        label: '3 дня'
    },
    {
        value: dayjs().add(5, 'day').toDate(),
        label: '5 дней'
    },
    {
        value: dayjs().add(7, 'day').toDate(),
        label: 'Неделю'
    },
    {
        value: dayjs().add(14, 'day').toDate(),
        label: '2 недели'
    },
    {
        value: dayjs().add(1, 'month').toDate(),
        label: 'Месяц'
    },
    {
        value: dayjs().add(3, 'month').toDate(),
        label: '3 месяца'
    },
    {
        value: dayjs().add(6, 'month').toDate(),
        label: 'Пол года'
    },
    {
        value: dayjs().add(9, 'month').toDate(),
        label: '9 месяцев'
    }
];

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    emit('confirm', newDate.value);
}
</script>
