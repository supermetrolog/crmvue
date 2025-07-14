<template>
    <Modal
        @close="emit('close')"
        show
        :title="formData ? 'Изменение группы компаний' : 'Создание группы компаний'"
        width="600"
    >
        <UiForm @submit="onSubmit">
            <Loader v-if="isLoading" />
            <UiFormGroup>
                <UiInput
                    v-model="form.nameRu"
                    :v="v$.nameRu"
                    label="Название Ru"
                    required
                    class="col-12 mb-2"
                />
                <UiInput
                    v-model="form.nameEng"
                    :v="v$.nameEng"
                    label="Название Eng"
                    class="col-8"
                />
                <MultiSelect
                    v-model="form.formOfOrganization"
                    label="ФО"
                    title="Форма организации"
                    class="col-4"
                    :options="CompanyFormOrganization"
                />
            </UiFormGroup>
            <UiFormGroup>
                <UiTextarea v-model="form.description" label="Описание" class="col-12" />
            </UiFormGroup>
            <Submit success center class="mt-3 mx-auto">
                {{ formData ? 'Сохранить' : 'Создать' }}
            </Submit>
        </UiForm>
    </Modal>
</template>

<script setup>
import { useStore } from 'vuex';
import { helpers, required } from '@vuelidate/validators';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import { CompanyFormOrganization } from '@/const/const.js';
import Loader from '@/components/common/Loader.vue';
import Modal from '@/components/common/Modal.vue';
import { onlyEnglish, onlyRussian } from '@//validators';
import Submit from '@/components/common/Forms/FormSubmit.vue';
import { reactive, ref } from 'vue';
import { useValidation } from '@/composables/useValidation.js';
import { useFormData } from '@/utils/use/useFormData.js';

const emit = defineEmits(['close', 'updated', 'created']);
const props = defineProps({ formData: Object });
const store = useStore();

const isLoading = ref(false);

const { form, isEditMode } = useFormData(
    reactive({
        nameRu: null,
        nameEng: null,
        description: null,
        formOfOrganization: null
    }),
    props.formData
);

const rules = {
    nameRu: {
        required: helpers.withMessage('Введите название', required),
        onlyRussian: helpers.withMessage('Название должно быть на русском языке', onlyRussian)
    },
    nameEng: {
        onlyEnglish: helpers.withMessage('Название должно быть на английском языке', onlyEnglish)
    }
};

const { v$, validate } = useValidation(rules, form);

const update = async () => {
    isLoading.value = true;

    const updated = await store.dispatch('UPDATE_COMPANY_GROUPS', form);

    if (updated) {
        emit('updated');
        emit('close');
    }

    isLoading.value = false;
};

const create = async () => {
    isLoading.value = true;

    const created = await store.dispatch('CREATE_COMPANY_GROUPS', form);

    if (created) {
        emit('created');
        emit('close');
    }

    isLoading.value = false;
};

async function onSubmit() {
    const isValid = await validate();
    if (!isValid) return;

    if (isEditMode.value) await update();
    else await create();
}
</script>
