<template>
    <Form @submit="onSubmit">
        <FormGroup>
            <div class="col-12 col-md-8">
                <Input
                    v-model="form.all"
                    @keydown.enter="onSubmit"
                    label="Поиск"
                    placeholder="Название компании, ID компании, ФИО брокера, ФИО контакта, телефон"
                />
            </div>
            <div class="col-12 col-md-4 align-self-end">
                <div class="form-search__actions">
                    <Button
                        @click="extraIsVisible = !extraIsVisible"
                        :badge="filtersCount || false"
                    >
                        Фильтры
                    </Button>
                    <Button @click="resetForm" :disabled="!filtersCount" danger>
                        Сбросить фильтры
                    </Button>
                </div>
            </div>
        </FormGroup>
        <Modal v-if="extraIsVisible" @close="extraIsVisible = false" title="Фильтры">
            <FormGroup>
                <MultiSelect
                    v-model="form.consultant_id"
                    label="Консультант"
                    class="col-md-4 col-12"
                    :options="
                        async () => {
                            return await FETCH_CONSULTANT_LIST();
                        }
                    "
                />
                <Input
                    v-model="form.nameRu"
                    label="Название RU"
                    placeholder="Название (Ru)"
                    class="col-md-4 col-12"
                    :v="v$.form.nameRu"
                    reactive
                />
                <Input
                    v-model="form.nameEng"
                    label="Название ENG"
                    placeholder="Название (Eng)"
                    class="col-md-4 col-12"
                    :v="v$.form.nameEng"
                    reactive
                />
            </FormGroup>
            <FormGroup>
                <MultiSelect
                    v-model="form.activityGroup"
                    title="Группа деятельности"
                    label="Группа дея-ти"
                    class="col-12 col-md-4"
                    :options="ActivityGroupList"
                />
                <MultiSelect
                    v-model="form.activityProfile"
                    title="Профиль деятельности"
                    label="Профиль дея-ти"
                    class="col-12 col-md-4"
                    :options="ActivityProfileList"
                />
                <DoubleInput
                    v-model:first="form.dateStart"
                    v-model:second="form.dateEnd"
                    label="Дата"
                    class="col-12 col-md-4"
                    type="date"
                    :validators="formDateValidators"
                />
            </FormGroup>
            <FormGroup>
                <CheckboxOptions
                    v-model="form.categories"
                    class="col-md-8 col-12"
                    label="Категория"
                    :options="CompanyCategories"
                />
                <RadioOptions
                    v-model="form.status"
                    class="col-md-4 col-12"
                    label="Статус"
                    :options="ActivePassive"
                />>
            </FormGroup>
        </Modal>
    </Form>
</template>

<script setup>
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import Input from '@/components/common/Forms/Input.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import {
    ActivePassive,
    ActivityGroupList,
    ActivityProfileList,
    CompanyCategories
} from '@/const/const.js';
import Button from '@/components/common/Button.vue';
import { helpers } from '@vuelidate/validators';
import { maxDate, onlyEnglish, onlyRussian } from '@//validators';
import DoubleInput from '@/components/common/Forms/DoubleInput.vue';
import { deleteEmptyFields } from '@/utils/deleteEmptyFields.js';
import Modal from '@/components/common/Modal.vue';
import { computed, reactive, shallowRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSearchForm } from '@/composables/useSearchForm.js';
import { useStore } from 'vuex';
import useValidate from '@vuelidate/core';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import CheckboxOptions from '@/components/common/Forms/CheckboxOptions.vue';

const route = useRoute();
const router = useRouter();
const store = useStore();

const emit = defineEmits(['search', 'reset']);

const formTemplate = {
    all: null,
    nameRu: null,
    nameEng: null,
    consultant_id: null,
    categories: [],
    activityGroup: null,
    activityProfile: null,
    dateStart: null,
    dateEnd: null,
    status: null
};

const form = reactive({});
const extraIsVisible = shallowRef(false);

const formDateValidators = computed(() => [
    {
        func: maxDate(form.dateEnd),
        message: 'Дата ОТ не может быть позже ДО',
        property: 'first'
    }
]);

const setQueryFields = async () => {
    Object.assign(form, route.query);

    if (form.categories && !Array.isArray(form.categories)) form.categories = [form.categories];

    let query = { ...form };
    deleteEmptyFields(query);
    await router.replace({ query });
};

const rules = {
    form: {
        nameRu: {
            onlyRussian: helpers.withMessage('Название должно быть на русском языке', onlyRussian)
        },
        nameEng: {
            onlyEnglish: helpers.withMessage(
                'Название должно быть на английском языке',
                onlyEnglish
            )
        }
    }
};

const onSubmit = query => {
    emit('search', query);
};

const FETCH_CONSULTANT_LIST = () => store.dispatch('FETCH_CONSULTANT_LIST');

const v$ = useValidate(rules, { form });
const { filtersCount, resetForm } = useSearchForm(form, {
    template: formTemplate,
    submit: onSubmit,
    syncWithQuery: true,
    setQuery: setQueryFields
});
</script>
