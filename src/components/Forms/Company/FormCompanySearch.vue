<template>
    <Form @submit="onSubmit" class="row">
        <div class="col-8">
            <Input
                v-model="form.all"
                @keydown.enter="onSubmit"
                label="Поиск"
                placeholder="Название компании, ID компании, ФИО брокера, ФИО контакта, телефон"
            />
        </div>
        <div class="col-4 align-self-end">
            <div class="form-search__actions">
                <Button @click="extraVisible = !extraVisible" icon :badge="filterCount || false">
                    <span>Фильтры</span>
                    <i v-if="extraVisible" class="fas fa-angle-up"></i>
                    <i v-else class="fas fa-angle-down"></i>
                </Button>
                <Button @click="resetForm" :disabled="!filterCount" danger>Сбросить фильтры</Button>
            </div>
        </div>
        <Modal v-if="extraVisible" @close="extraVisible = false" title="Фильтры">
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
                    class="col-md-4 col-6"
                    :v="v$.form.nameRu"
                    reactive
                />
                <Input
                    v-model="form.nameEng"
                    label="Название ENG"
                    placeholder="Название (Eng)"
                    class="col-md-4 col-6"
                    :v="v$.form.nameEng"
                    reactive
                />
            </FormGroup>
            <FormGroup>
                <MultiSelect
                    v-model="form.activityGroup"
                    title="Группа деятельности"
                    label="Группа дея-ти"
                    class="col-md-4"
                    :options="activityGroupOptions"
                />
                <MultiSelect
                    v-model="form.activityProfile"
                    title="Профиль деятельности"
                    label="Профиль дея-ти"
                    class="col-md-4"
                    :options="activityProfileOptions"
                />
                <DoubleInput
                    v-model:first="form.dateStart"
                    v-model:second="form.dateEnd"
                    label="Дата"
                    class="col-4"
                    type="date"
                    :validators="formDateValidators"
                />
            </FormGroup>
            <FormGroup>
                <div class="col-md-8 col-12">
                    <span class="form__subtitle">Категория</span>
                    <div class="form__row mt-1">
                        <CheckboxChip
                            v-for="(option, index) in categoryOptions"
                            :key="index"
                            v-model="form.categories"
                            :value="index"
                            :text="$formatter.text().ucFirst(option)"
                        />
                    </div>
                </div>
                <div class="col-md-4 col-12">
                    <span class="form__subtitle">Статус</span>
                    <div class="form__row mt-1">
                        <RadioChip v-model="form.status" label="Актив" :value="1" unselect />
                        <RadioChip v-model="form.status" label="Пассив" :value="0" unselect />
                    </div>
                </div>
            </FormGroup>
        </Modal>
    </Form>
</template>

<script>
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
import { SearchFormMixin } from '@/components/common/mixins.js';
import Button from '@/components/common/Button.vue';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import { helpers } from '@vuelidate/validators';
import { maxDate, onlyEnglish, onlyRussian } from '@//validators';
import useVuelidate from '@vuelidate/core';
import DoubleInput from '@/components/common/Forms/DoubleInput.vue';
import { deleteEmptyFields } from '@/utils/deleteEmptyFields.js';
import Modal from '@/components/common/Modal.vue';

export default {
    name: 'FormCompanySearch',
    components: {
        Modal,
        DoubleInput,
        RadioChip,
        CheckboxChip,
        Button,
        Form,
        FormGroup,
        Input,
        MultiSelect
    },
    mixins: [SearchFormMixin],
    data() {
        return {
            v$: useVuelidate()
        };
    },
    validations() {
        return {
            form: {
                nameRu: {
                    onlyRussian: helpers.withMessage(
                        'Название должно быть на русском языке',
                        onlyRussian
                    )
                },
                nameEng: {
                    onlyEnglish: helpers.withMessage(
                        'Название должно быть на английском языке',
                        onlyEnglish
                    )
                }
            }
        };
    },
    computed: {
        categoryOptions: () => CompanyCategories,
        activityGroupOptions: () => ActivityGroupList,
        activityProfileOptions: () => ActivityProfileList,
        activePassiveOptions: () => ActivePassive,
        formDateValidators() {
            return [
                {
                    func: maxDate(this.form.dateEnd),
                    message: 'Дата ОТ не может быть позже ДО',
                    property: 'first'
                }
            ];
        }
    },
    defaultFormProperties: {
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
    },
    methods: {
        async setQueryFields() {
            this.form = { ...this.form, ...this.$route.query };
            if (this.form.categories && !Array.isArray(this.form.categories)) {
                this.form.categories = [this.form.categories];
            }
            let query = { ...this.form };
            deleteEmptyFields(query);
            await this.$router.replace({ query });
        }
    }
};
</script>

<style></style>
