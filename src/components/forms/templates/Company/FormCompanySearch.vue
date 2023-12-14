<template>
    <div class="company-search-form">
        <Form class="autosize" @submit="onSubmit">
            <FormGroup class="mb-2 px-md-5">
                <Input
                    v-model="form.all"
                    label="Поиск"
                    placeholder="название компании, ID компании, ФИО брокера, ФИО контакта, телефон"
                    class="col-12 main-input pr-1"
                    @keydown.enter="onSubmit"
                />
            </FormGroup>
            <FormGroup class="px-md-5">
                <a
                    href="#"
                    @click.prevent="extraVisible = !extraVisible"
                    class="text-primary"
                >
                    фильтры
                    <span class="badge badge-danger" v-if="filterCount">
            {{ filterCount }}
          </span>
                    <i class="fas fa-angle-down" v-if="!extraVisible"></i>
                    <i class="fas fa-angle-up" v-else></i>
                </a>
                <a
                    href="#"
                    @click.prevent="resetForm"
                    class="text-primary ml-5"
                    v-if="filterCount"
                >
                    сбросить
                </a>
            </FormGroup>

            <div v-show="extraVisible">
                <FormGroup class="mb-1 px-md-5">
                    <MultiSelect
                        v-model="form.consultant_id"
                        label="Консультант"
                        class="col-md-4 col-12 pr-1"
                        :options="
              async () => {
                return await FETCH_CONSULTANT_LIST();
              }
            "
                    />
                    <Input
                        v-model="form.nameRu"
                        label="Название RU"
                        placeholder="название ru"
                        class="col-md-4 col-6 pr-1"
                    />
                    <Input
                        v-model="form.nameEng"
                        label="Название ENG"
                        placeholder="название eng"
                        class="col-md-4 col-6"
                    />
                </FormGroup>
                <FormGroup class="mb-1 px-md-5">
                    <MultiSelect
                        v-model="form.activityGroup"
                        title="Группа деятельности"
                        label="Группа дея-ти"
                        class="col-md-4 pr-1"
                        :options="activityGroupOptions"
                    />
                    <MultiSelect
                        v-model="form.activityProfile"
                        title="Профиль деятельности"
                        label="Профиль дея-ти"
                        class="col-md-4 pr-1"
                        :options="activityProfileOptions"
                    />
                    <Input
                        v-model="form.dateStart"
                        label="Дата от"
                        class="col-md-2 col-6 pr-1"
                        type="date"
                    />
                    <Input
                        v-model="form.dateEnd"
                        label="Дата до"
                        class="col-md-2 col-6"
                        type="date"
                    />
                </FormGroup>
                <FormGroup class="px-md-5">
                    <Checkbox
                        v-model="form.categories"
                        :options="categoryOptions"
                        label="Категория"
                        class="col-md-8 pr-1"
                    />
                    <Radio
                        v-model="form.status"
                        :options="activePassiveOptions"
                        :unselectMode="true"
                        label="Статус"
                        class="col-md-2 pr-1"
                    />
                </FormGroup>
            </div>
        </Form>
    </div>
</template>

<script>
import Form from "@/components/forms/Form.vue";
import FormGroup from "@/components/forms/FormGroup.vue";
import Input from "@/components/forms/Input.vue";
import MultiSelect from "@/components/forms/MultiSelect.vue";
import Checkbox from "@/components/forms/Checkbox.vue";
import Radio from "@/components/forms/Radio.vue";
import {ActivePassive, ActivityGroupList, ActivityProfileList, CompanyCategories,} from "@/const/const.js";
import {SearchFormMixin} from "@/components/common/mixins.js";

export default {
    mixins: [SearchFormMixin],
    name: "FormCompanySearch",
    components: {
        Form,
        FormGroup,
        Input,
        MultiSelect,
        Checkbox,
        Radio,
    },
    data() {
        return {
            categoryOptions: CompanyCategories.get("param"),
            activityGroupOptions: ActivityGroupList.get("param"),
            activityProfileOptions: ActivityProfileList.get("param"),
            activePassiveOptions: ActivePassive.get("param"),
        };
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
        status: null,
    },
    methods: {
        async setQueryFields() {
            this.form = {...this.form, ...this.$route.query};
            if (this.form.categories && !Array.isArray(this.form.categories)) {
                this.form.categories = [this.form.categories];
            }
            let query = {...this.form};
            this.deleteEmptyFields(query);
            await this.$router.replace({query});
        },
    },
};
</script>

<style>
</style>