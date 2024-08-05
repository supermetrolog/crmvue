<template>
    <Modal
        @close="emit('close')"
        show
        :title="formData ? 'Изменение группы компаний' : 'Создание группы компаний'"
        width="600"
    >
        <Form @submit="onSubmit">
            <Loader v-if="isLoading" />
            <FormGroup>
                <Input
                    v-model="form.nameRu"
                    :v="v$.nameRu"
                    label="Название Ru"
                    required
                    class="col-12 mb-2"
                    :maska="{
                        mask: 'Z*',
                        tokens: { Z: { pattern: /[а-яА-Я0-9 ]/ } }
                    }"
                />
                <Input
                    v-model="form.nameEng"
                    :v="v$.nameEng"
                    label="Название Eng"
                    class="col-8"
                    :maska="{
                        mask: 'Z*',
                        tokens: { Z: { pattern: /[a-zA-Z0-9 ]/ } }
                    }"
                />
                <MultiSelect
                    v-model="form.formOfOrganization"
                    label="ФО"
                    title="Форма организации"
                    class="col-4"
                    :options="CompanyFormOrganization"
                />
            </FormGroup>
            <FormGroup>
                <Textarea v-model="form.description" label="Описание" class="col-12" />
            </FormGroup>
            <Submit success center class="mt-3 mx-auto">
                {{ formData ? 'Сохранить' : 'Создать' }}
            </Submit>
        </Form>
    </Modal>
</template>

<script setup>
import { useStore } from 'vuex';
import useValidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import Input from '@/components/common/Forms/Input.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import { CompanyFormOrganization } from '@/const/const.js';
import Loader from '@/components/common/Loader.vue';
import Modal from '@/components/common/Modal.vue';
import { onlyEnglish, onlyRussian } from '@//validators';
import Submit from '@/components/common/Forms/FormSubmit.vue';
import { onMounted, reactive, shallowRef } from 'vue';

const emit = defineEmits(['close', 'updated', 'created']);
const props = defineProps({ formData: { type: Object, default: null } });
const store = useStore();

const isLoading = shallowRef(false);
const form = reactive({
    nameRu: null,
    nameEng: null,
    description: null,
    formOfOrganization: null
});

const rules = {
    nameRu: {
        required: helpers.withMessage('Введите название', required),
        onlyRussian: helpers.withMessage('Название должно быть на русском языке', onlyRussian)
    },
    nameEng: {
        onlyEnglish: helpers.withMessage('Название должно быть на английском языке', onlyEnglish)
    }
};

const v$ = useValidate(rules, form);

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

const onSubmit = () => {
    v$.$validate();

    if (!v$.form.$error) {
        if (props.formData) update();
        else create();
    }
};

onMounted(() => {
    if (props.formData) Object.assign(form, props.formData);
});
</script>
