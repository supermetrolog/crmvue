<template>
    <UiModal
        @close="$emit('close')"
        custom-close
        :title="`Архивация компании #${company.id} | ${shortName}`"
        :close-on-outside-click="false"
        :width="900"
        show
    >
        <UiForm>
            <Loader v-if="isLoading" />
            <UiFormGroup>
                <UiCol :cols="8">
                    <MultiSelect
                        v-model="form.passive_why"
                        :v="v$.form.passive_why"
                        required
                        label="Причина"
                        :options="companyOptions.passiveWhyList"
                    />
                    <UiTextarea
                        v-model="form.passive_why_comment"
                        :v="v$.form.passive_why_comment"
                        label="Комментарий"
                        auto-height
                        :min-height="100"
                        :max-height="300"
                        class="mt-2"
                    />
                </UiCol>
                <UiCol :cols="4" class="modal-aside">
                    <p class="font-weight-semi mb-2">События при архивации</p>
                    <Switch
                        v-model="form.disable_requests"
                        true-title="Архивировать запросы"
                        :transform="Number"
                        class="mb-3"
                    />
                    <Switch
                        v-model="form.disable_contacts"
                        true-title="Архивировать контакты"
                        :transform="Number"
                    />
                </UiCol>
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
import { computed, reactive, ref } from 'vue';
import api from '@/api/api.js';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useValidation } from '@/composables/useValidation.js';
import { helpers, required } from '@vuelidate/validators';
import UiModal from '@/components/common/UI/UiModal.vue';
import { getCompanyShortName } from '@/utils/formatters/models/company.js';
import { companyOptions } from '@/const/options/company.options.js';
import UiCol from '@/components/common/UI/UiCol.vue';
import Switch from '@/components/common/Forms/Switch.vue';

const emit = defineEmits(['disabled', 'close']);
const props = defineProps({
    company: {
        type: Object,
        required: true
    }
});

const isLoading = ref(false);

const form = reactive({
    passive_why: null,
    passive_why_comment: null,
    disable_requests: 1,
    disable_contacts: 1
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
        const disabled = await api.companies.disable(props.company.id, form);
        if (disabled) emit('disabled', form);
    } finally {
        isLoading.value = false;
    }
}

const shortName = computed(() => getCompanyShortName(props.company));
</script>
