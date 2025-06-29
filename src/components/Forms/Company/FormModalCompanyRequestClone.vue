<template>
    <UiModal
        @close="$emit('close')"
        custom-close
        show
        :width="750"
        :title="`Клонирование запроса #${request.id}`"
    >
        <Loader v-if="isLoading" />
        <UiForm>
            <UiFormGroup>
                <ConsultantPicker
                    v-model="form.consultant_id"
                    :v="v$.form.consultant_id"
                    :options="getConsultantsOptions"
                    required
                    class="col-12"
                >
                    <template #after>
                        <div class="d-flex gap-1 flex-wrap">
                            <AnimationTransition :speed="0.4">
                                <UiButton
                                    v-if="consultantIsLoading || companyConsultant"
                                    @click.prevent="assignToCompanyConsultant"
                                    small
                                    color="light"
                                    icon="fa-solid fa-user-lock"
                                    :disabled="assignedToCompanyConsultant"
                                    :loading="consultantIsLoading"
                                >
                                    <span v-if="consultantIsLoading" class="fs-2 text-grey">
                                        Поиск консультанта
                                    </span>
                                    <template v-else-if="companyConsultant">
                                        <span>
                                            {{ companyConsultant.userProfile.medium_name }}
                                        </span>
                                        <span class="text-grey fs-2"> (Конс. компании) </span>
                                    </template>
                                </UiButton>
                            </AnimationTransition>
                            <UiButton
                                v-if="
                                    requestConsultant &&
                                    requestConsultant?.id !== companyConsultant?.id
                                "
                                @click.prevent="assignOldRequestConsultant"
                                small
                                color="light"
                                icon="fa-solid fa-user-lock"
                                :disabled="assignedToOldRequestConsultant"
                            >
                                <span>
                                    {{ requestConsultant.userProfile.medium_name }}
                                </span>
                                <span class="text-grey fs-2"> (Конс. текущ. запроса) </span>
                            </UiButton>
                        </div>
                    </template>
                </ConsultantPicker>
            </UiFormGroup>
            <UiFormDivider />
            <UiFormGroup>
                <UiCol :cols="12">
                    <CompanyBoxRequestsListItem :request read-only />
                </UiCol>
            </UiFormGroup>
        </UiForm>
        <template #actions="{ close }">
            <UiButton @click="submit" color="success-light" icon="fa-solid fa-check" bolder>
                Клонировать
            </UiButton>
            <UiButton @click="close" color="light" icon="fa-solid fa-ban" bolder>Отмена</UiButton>
        </template>
    </UiModal>
</template>

<script setup>
import UiForm from '@/components/common/Forms/UiForm.vue';
import Loader from '@/components/common/Loader.vue';
import CompanyBoxRequestsListItem from '@/components/Company/Box/CompanyBoxRequestsListItem.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import { helpers, required } from '@vuelidate/validators';
import api from '@/api/api.js';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import { computed, reactive, ref, shallowRef, watch } from 'vue';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useValidation } from '@/composables/useValidation.js';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';

const emit = defineEmits(['cloned', 'close']);
const props = defineProps({
    request: {
        type: Object,
        required: true
    }
});

const { getConsultantsOptions } = useConsultantsOptions();

const isLoading = ref(false);

const form = reactive({
    consultant_id: null
});

const { v$, validate } = useValidation(
    {
        form: {
            consultant_id: {
                required: helpers.withMessage('Выберите консультанта', required)
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
        const createdRequest = await api.request.clone(props.request.id, form);
        if (createdRequest) emit('cloned', createdRequest);
    } finally {
        isLoading.value = false;
    }
}

// consultants

// company consultant

const companyConsultant = shallowRef(null);
const requestConsultant = shallowRef(null);
const consultantIsLoading = ref(false);

async function fetchConsultant() {
    try {
        consultantIsLoading.value = true;

        const company = await api.companies.getCompany(props.request.company_id);
        companyConsultant.value = company.consultant;
    } catch (e) {
        companyConsultant.value = null;
    } finally {
        consultantIsLoading.value = false;
    }
}

watch(
    () => props.request?.id,
    value => {
        if (value) {
            requestConsultant.value = props.request?.consultant;
            fetchConsultant();
        } else {
            companyConsultant.value = null;
            requestConsultant.value = null;
        }
    },
    { immediate: true }
);

function assignToCompanyConsultant() {
    if (companyConsultant.value) {
        form.consultant_id = companyConsultant.value.id;
    }
}

const assignedToCompanyConsultant = computed(
    () => form.consultant_id === companyConsultant.value?.id
);

function assignOldRequestConsultant() {
    if (requestConsultant.value) {
        form.consultant_id = requestConsultant.value.id;
    }
}

const assignedToOldRequestConsultant = computed(
    () => form.consultant_id === requestConsultant.value?.id
);
</script>
