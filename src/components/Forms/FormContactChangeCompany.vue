<template>
    <UiModal
        @close="$emit('close')"
        custom-close
        :title="`Перенос контакта #${contact.id} | ${contact.full_name}`"
        :close-on-outside-click="false"
        :width="700"
        :pinned-task
        show
    >
        <template #header-actions>
            <UiButtonIcon
                @click="runTour"
                mini
                label="Помощь"
                icon="fa-solid fa-question"
                color="light"
            />
        </template>
        <UiForm>
            <Loader v-if="isLoading" />
            <Spinner v-if="contactCompanyIsLoading" small label="Загрузка текущей компании.." />
            <UiFormGroup
                v-else-if="contactCompany"
                data-tour-id="contact-change-company:current-company"
            >
                <UiCol :cols="12">
                    <p class="text-grey">Текущая компания</p>
                </UiCol>
                <UiCol :cols="12">
                    <CompanyRowCard :company="contactCompany" />
                </UiCol>
                <UiCheckbox
                    v-model="form.disable_contact"
                    :true-value="1"
                    :false-value="0"
                    class="col-12"
                    data-tour-id="contact-change-company:disable-contact"
                >
                    Архивировать контакт в текущей компании
                </UiCheckbox>
            </UiFormGroup>
            <UiFormDivider />
            <UiFormGroup>
                <CompanyPicker
                    v-model="form.company_id"
                    :v="v$.company_id"
                    :options="searchCompany"
                    label="Выбор новой компании"
                    placement="top"
                    class="col-12"
                    required
                    data-tour-id="contact-change-company:company-picker"
                >
                    <template #after>
                        <UiCheckbox v-model="form.is_main" :true-value="1" :false-value="null">
                            Указать контакт как главный
                        </UiCheckbox>
                    </template>
                </CompanyPicker>
                <ConsultantPicker
                    v-model="form.consultant_id"
                    :v="v$.consultant_id"
                    :options="getConsultantsOptions"
                    required
                    label="Назначить консультанта"
                    class="col-12"
                    data-tour-id="contact-change-company:consultant-picker"
                />
            </UiFormGroup>
        </UiForm>
        <FormContactChangeCompanyTour ref="tourEl" />
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
import Loader from '@/components/common/Loader.vue';
import { reactive, ref, shallowRef, useTemplateRef, watch } from 'vue';
import api from '@/api/api.js';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useValidation } from '@/composables/useValidation.js';
import { helpers, required } from '@vuelidate/validators';
import UiModal from '@/components/common/UI/UiModal.vue';
import CompanyPicker from '@/components/common/Forms/CompanyPicker/CompanyPicker.vue';
import { useSearchCompany } from '@/composables/useSearchCompany.js';
import CompanyRowCard from '@/components/CompanyRowCard/CompanyRowCard.vue';
import Spinner from '@/components/common/Spinner.vue';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import UiCheckbox from '@/components/common/Forms/UiCheckbox.vue';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import FormContactChangeCompanyTour from '@/components/Forms/FormContactChangeCompanyTour.vue';

const emit = defineEmits(['changed', 'close']);
const props = defineProps({
    contact: {
        type: Object,
        required: true
    },
    pinnedTask: Object
});

// company

const contactCompany = shallowRef(null);
const contactCompanyIsLoading = ref(null);

async function fetchContactCompany() {
    contactCompanyIsLoading.value = true;

    try {
        contactCompany.value = await api.companies.getCompany(props.contact.company_id);
    } finally {
        contactCompanyIsLoading.value = false;
    }
}

watch(
    () => props.contact?.company_id,
    value => {
        if (value) {
            fetchContactCompany();
        } else {
            contactCompany.value = null;
        }
    },
    { immediate: true }
);

//

const searchCompany = useSearchCompany();
const { getConsultantsOptions } = useConsultantsOptions();

const isLoading = ref(false);

const form = reactive({
    consultant_id: props.contact.consultant_id,
    disable_contact: 1,
    is_main: null,
    company_id: null
});

const { v$, validate } = useValidation(
    {
        company_id: {
            required: helpers.withMessage('Выберите компанию', required),
            notEqualsCurrentCompany: helpers.withMessage(
                'Нельзя перенести в текущую компанию',
                value => value !== props.contact.company_id
            )
        },
        consultant_id: {
            required: helpers.withMessage('Выберите консультанта', required)
        }
    },
    form
);

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    isLoading.value = true;

    try {
        const response = await api.contacts.transferToCompany(props.contact.id, form);
        emit('changed', response);
    } finally {
        isLoading.value = false;
    }
}

// tour

const tourEl = useTemplateRef('tourEl');

function runTour() {
    tourEl.value?.run();
}
</script>
