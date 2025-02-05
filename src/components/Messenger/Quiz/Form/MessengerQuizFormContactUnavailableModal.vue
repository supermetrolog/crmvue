<template>
    <UiModal
        v-model:visible="visible"
        @closed="cancel"
        :width="800"
        :close-on-press-esc="false"
        :close-on-outside-click="false"
        title="Результат звонка"
    >
        <RadioOptions
            v-model="model.form.reason"
            :v="v$.reason"
            required
            unselect
            :options="REASON_OPTIONS"
            label="Выберите причину"
        />
        <template #footer>
            <Button @click="submit" :disabled="!model.form?.reason" success>Подтвердить</Button>
            <Button @click="cancel" danger>Отмена</Button>
        </template>
    </UiModal>
</template>
<script setup>
import Button from '@/components/common/Button.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import { toRef } from 'vue';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { useValidationNotify } from '@/composables/useValidationNotify.js';

const visible = defineModel('visible');
const model = defineModel('form');
const emit = defineEmits(['confirm', 'cancel']);
defineProps({
    contacts: {
        type: Array,
        default: () => []
    }
});

const REASON_OPTIONS = {
    1: 'Не отвечает',
    2: 'Не доступен',
    3: 'Заблокирован'
};

const v$ = useVuelidate(
    {
        reason: {
            required: helpers.withMessage(`Выберите причину недозвона`, required)
        }
    },
    {
        reason: toRef(() => model.value?.form?.reason)
    }
);

const { validateWithNotify } = useValidationNotify(v$);

function submit() {
    validateWithNotify();
    if (v$.value.$invalid) return;

    emit('confirm');
}

function cancel() {
    model.value.form.available = null;
    model.value.form.reason = null;

    emit('cancel');
}
</script>
