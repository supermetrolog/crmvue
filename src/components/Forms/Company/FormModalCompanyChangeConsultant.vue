<template>
    <UiModal
        @close="$emit('close')"
        custom-close
        show
        :width="750"
        :title="`Изменение консультанта компании | ${companyName}`"
    >
        <Loader v-if="isLoading" />
        <UiForm>
            <UiFormGroup>
                <UiCol v-if="company.consultant" :cols="12">
                    <p class="text-grey mb-1 font-weight-semi">Текущий консультант компании:</p>
                    <div class="dashboard-bg-light br-1 py-1 px-2">
                        <div class="d-flex gap-2 align-items-center">
                            <Avatar :src="company.consultant.userProfile.avatar" :size="40" />
                            <span class="font-weight-semi">
                                {{ company.consultant.userProfile.full_name }},
                            </span>
                            <span class="text-grey">{{ consultantRole }}</span>
                            <span
                                v-if="company.consultant.is_online"
                                class="text-grey fs-2 ml-auto align-self-end"
                            >
                                <i class="fa-solid fa-circle mr-1 dashboard-cl-success fs-1" />
                                <span>Сейчас в сети</span>
                            </span>
                            <span
                                v-else-if="company.consultant.last_seen"
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
                    :options="getConsultantsOptions"
                    required
                    label="Новый консультант"
                    class="col-12"
                >
                    <template #after>
                        <Switch
                            v-model="form.change_requests_consultants"
                            true-title="Перенести запросы на консультанта"
                            :transform="Number"
                        />
                    </template>
                </ConsultantPicker>
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
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import { helpers, required } from '@vuelidate/validators';
import api from '@/api/api.js';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import { computed, reactive, ref } from 'vue';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useValidation } from '@/composables/useValidation.js';
import Avatar from '@/components/common/Avatar.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import { userOptions } from '@/const/options/user.options.js';
import { toBeautifulDateFormat } from '@/utils/formatters/date.js';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import { getCompanyShortName } from '@/utils/formatters/models/company.js';
import Switch from '@/components/common/Forms/Switch.vue';

const emit = defineEmits(['changed', 'close']);
const props = defineProps({
    company: {
        type: Object,
        required: true
    }
});

const companyName = computed(() => getCompanyShortName(props.company));

const { getConsultantsOptions } = useConsultantsOptions();

const isLoading = ref(false);

const form = reactive({
    consultant_id: null,
    change_requests_consultants: true
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
        const company = await api.companies.changeConsultant(props.company.id, form);
        if (company) emit('changed', company, form);
    } finally {
        isLoading.value = false;
    }
}

// current consultant

const consultantRole = computed(() => userOptions.role[props.company.consultant.role]);
const lastSeen = computed(() => toBeautifulDateFormat(props.company.consultant.last_seen));
</script>
