<template>
    <UiModal
        @close="$emit('close')"
        custom-close
        :title="`Архивация контакта #${contact.id} | ${contact.full_name}`"
        :close-on-outside-click="false"
        :width="900"
        show
    >
        <UiForm>
            <Loader v-if="isLoading" />
            <UiFormGroup>
                <MultiSelect
                    v-model="form.passive_why"
                    :v="v$.form.passive_why"
                    required
                    label="Причина"
                    class="col-12"
                    :options="contactOptions.passiveWhy"
                />
                <UiTextarea
                    v-model="form.passive_why_comment"
                    :v="v$.form.passive_why_comment"
                    label="Комментарий"
                    auto-height
                    :min-height="100"
                    :max-height="300"
                    class="mt-2 col-12"
                />
            </UiFormGroup>
        </UiForm>
        <template #actions="{ close }">
            <UiButton @click="submit" color="success-light" icon="fa-solid fa-check">
                Подтвердить
            </UiButton>
            <UiButton @click="close" color="light" icon="fa-solid fa-ban">Отмена</UiButton>
        </template>
    </UiModal>
</template>

<script setup>
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import Loader from '@/components/common/Loader.vue';
import { reactive, ref } from 'vue';
import api from '@/api/api.js';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useValidation } from '@/composables/useValidation.js';
import { helpers, required } from '@vuelidate/validators';
import UiModal from '@/components/common/UI/UiModal.vue';
import { contactOptions } from '@/const/options/contact.options.js';

const emit = defineEmits(['disabled', 'close']);
const props = defineProps({
    contact: {
        type: Object,
        required: true
    }
});

const isLoading = ref(false);

const form = reactive({
    passive_why: null,
    passive_why_comment: null
});

const { v$, validate } = useValidation(
    {
        form: {
            passive_why: {
                required: helpers.withMessage('Выберите причину', required)
            }
        }
    },
    { form }
);

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    isLoading.value = true;

    try {
        const disabled = await api.contacts.disable(props.contact.id, form);
        if (disabled) emit('disabled', form);
    } finally {
        isLoading.value = false;
    }
}
</script>
