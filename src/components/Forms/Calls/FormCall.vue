<template>
    <UiModal
        @close="$emit('close')"
        custom-close
        :title="isEditMode ? `Редактирование звонка ${formData.id}` : 'Фиксация звонка'"
        :close-on-outside-click="false"
        :width="1000"
        show
    >
        <Loader v-if="isLoading" />
        <UiForm>
            <UiFormGroup>
                <ConsultantPicker
                    v-model="form.user_id"
                    :v="v$.form.user_id"
                    :options="getConsultantsOptions"
                    label="Сотрудник"
                    class="col-6"
                    required
                >
                    <template #after>
                        <UiButton
                            @click.prevent="assignToSelf"
                            small
                            color="light"
                            icon="fa-solid fa-user-astronaut"
                            :disabled="assignedToMe"
                        >
                            Указать себя
                        </UiButton>
                    </template>
                </ConsultantPicker>
                <MultiSelect
                    v-model="form.contact_id"
                    :options="searchContact"
                    label="Контакт"
                    :delay="500"
                    class="col-6"
                    searchable
                    can-deselect
                    resolve-on-load
                    :close-on-select="false"
                    placeholder="Выберите контакта.."
                    :filter-results="false"
                >
                    <template #option="{ option }">
                        <div class="d-flex flex-column">
                            <p class="font-weight-semi">
                                <span>{{ option.label ?? '- Без измени' }}</span>
                                <i v-if="option.isMain" class="fa-solid fa-crown ml-2" />
                            </p>
                            <p v-if="option.position" class="text-grey fs-2">
                                {{ option.position }}
                            </p>
                            <p class="fs-2">
                                Компания: <span class="font-weight-semi">{{ option.company }}</span>
                            </p>
                            <p v-if="option.phone" class="fs-2">Телефон: {{ option.phone }}</p>
                        </div>
                    </template>
                </MultiSelect>
            </UiFormGroup>
            <UiFormDivider />
            <UiFormGroup>
                <MultiSelect
                    v-model="form.type"
                    :v="v$.form.type"
                    label="Тип звонка"
                    class="col-5"
                    :options="callType"
                    placeholder="Укажите тип.."
                />
                <MultiSelect
                    v-model="form.status"
                    :v="v$.form.status"
                    label="Статус звонка"
                    class="col-7"
                    :options="callStatus"
                    placeholder="Укажите статус.."
                />
            </UiFormGroup>
            <UiFormDivider />
            <UiFormGroup>
                <UiTextarea
                    v-model="form.description"
                    :min-height="70"
                    :max-height="200"
                    auto-height
                    class="col-12"
                    label="Комментарии по звонку"
                    placeholder="Описание звонка, какие-то подробности, причины блокировки, цель звонка и прочее.."
                />
            </UiFormGroup>
        </UiForm>
        <template #actions="{ close }">
            <UiButton @click="submit" color="success-light" icon="fa-solid fa-check">
                Сохранить
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
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import { useFormData } from '@/utils/use/useFormData.js';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useValidation } from '@/composables/useValidation.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import { useAuth } from '@/composables/useAuth.js';
import { helpers, required } from '@vuelidate/validators';
import { callStatus, callType } from '@/const/options/call.options.js';
import { contactOptions } from '@/const/options/contact.options.js';
import { getCompanyShortName } from '@/utils/formatters/models/company.js';

const emit = defineEmits(['updated', 'created', 'close']);
const props = defineProps({
    formData: {
        type: Object,
        default: null
    }
});

const { getConsultantsOptions } = useConsultantsOptions();
const { currentUserId } = useAuth();

const isLoading = computed(() => isCreating.value || isUpdating.value);

const { form, isEditMode } = useFormData(
    reactive({
        user_id: currentUserId.value,
        contact_id: null,
        type: null,
        status: null,
        description: null
    }),
    props.formData
);

const { v$, validate } = useValidation(
    {
        form: {
            user_id: {
                required: helpers.withMessage('Укажите сотрудника', required)
            },
            contact_id: {
                required: helpers.withMessage('Укажите контакт', required)
            },
            type: {
                required: helpers.withMessage('Укажите тип звонка', required)
            },
            status: {
                required: helpers.withMessage('Укажите статус звонка', required)
            }
        }
    },
    { form }
);

const isUpdating = ref(false);

async function updateCall() {
    isUpdating.value = true;

    try {
        const updatedCall = await api.call.update(props.formData.id, form);
        emit('updated', updatedCall);
    } finally {
        isUpdating.value = false;
    }
}

const isCreating = ref(false);

async function createCall() {
    isCreating.value = true;

    try {
        const createdCall = await api.call.create(form);
        emit('created', createdCall);
        emit('close');
    } finally {
        isCreating.value = false;
    }
}

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    if (isEditMode.value) await updateCall();
    else await createCall();
}

async function searchContact(search) {
    let query = {};

    if (isNullish(search)) {
        const initialQuery = props.formData?.contact_id;

        if (initialQuery) query = { id: initialQuery };
        else return [];
    } else {
        query = { search };
    }

    const response = await api.contacts.list({ ...query, type: 0 });
    return response.data.map(element => ({
        value: element.id,
        label: element.full_name,
        isMain: element.isMain,
        position: element.position_unknown
            ? 'Должность неизвестна'
            : contactOptions.position[element.position],
        company: getCompanyShortName(element.company, element.company_id),
        phone: element.phones.length ? element.phones[0].phone : null
    }));
}

const assignedToMe = computed(() => form.user_id === currentUserId.value);

function assignToSelf() {
    form.user_id = currentUserId.value;
}
</script>
