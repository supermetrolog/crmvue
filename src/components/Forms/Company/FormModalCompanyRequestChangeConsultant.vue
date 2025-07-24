<template>
    <UiModal
        @close="$emit('close')"
        custom-close
        show
        :width="750"
        :title="`Изменение консультанта для запроса #${request.id}`"
    >
        <Loader v-if="isLoading" />
        <UiForm>
            <UiFormGroup>
                <UiCol v-if="request.consultant" :cols="12">
                    <p class="text-grey mb-1 font-weight-semi">Текущий консультант запроса:</p>
                    <div class="dashboard-bg-light br-1 py-1 px-2">
                        <div class="d-flex gap-2 align-items-center">
                            <Avatar :src="request.consultant.userProfile.avatar" :size="40" />
                            <span class="font-weight-semi">
                                {{ request.consultant.userProfile.full_name }},
                            </span>
                            <span class="text-grey">{{ consultantRole }}</span>
                            <span
                                v-if="request.consultant.is_online"
                                class="text-grey fs-2 ml-auto align-self-end"
                            >
                                <i class="fa-solid fa-circle mr-1 dashboard-cl-success fs-1" />
                                <span>Сейчас в сети</span>
                            </span>
                            <span
                                v-else-if="request.consultant.last_seen"
                                class="text-grey ml-auto fs-2 align-self-end"
                            >
                                <i class="fa-solid fa-circle text-grey fs-1" />
                                Был в сети {{ lastSeen }}
                            </span>
                        </div>
                    </div>
                </UiCol>
            </UiFormGroup>
            <UiFormDivider />
            <UiFormGroup>
                <ConsultantPicker
                    v-model="form.consultant_id"
                    :v="v$.form.consultant_id"
                    :options="getPreparedConsultantsOptions"
                    required
                    class="col-12"
                >
                    <template #after>
                        <div class="d-flex gap-1 flex-wrap">
                            <AnimationTransition :speed="0.4">
                                <UiButton
                                    v-if="
                                        consultantIsLoading ||
                                        (companyConsultant &&
                                            request.consultant_id !== companyConsultant.id)
                                    "
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
            <UiButton @click="submit" color="success-light" icon="fa-solid fa-user-check">
                Изменить консультанта
            </UiButton>
            <UiButton @click="close" color="light" icon="fa-solid fa-ban">Отмена</UiButton>
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
import Avatar from '@/components/common/Avatar.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import { userOptions } from '@/const/options/user.options.js';
import { toBeautifulDateFormat } from '@/utils/formatters/date.ts';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';

const emit = defineEmits(['changed', 'close']);
const props = defineProps({
    request: {
        type: Object,
        required: true
    }
});

const { getConsultantsOptions } = useConsultantsOptions();

async function getPreparedConsultantsOptions() {
    const consultantsOptions = await getConsultantsOptions();

    return consultantsOptions.filter(element => element.id !== props.request.consultant_id);
}

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
        const request = await api.request.changeConsultant(props.request.id, form);
        if (request) emit('changed', request);
    } finally {
        isLoading.value = false;
    }
}

// consultants

// company consultant

const companyConsultant = shallowRef(null);
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
            fetchConsultant();
        } else {
            companyConsultant.value = null;
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

// current consultant

const consultantRole = computed(() => userOptions.role[props.request.consultant.role]);
const lastSeen = computed(() => toBeautifulDateFormat(props.request.consultant.last_seen));
</script>
