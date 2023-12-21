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
                <AnimationTransition>
                    <Button v-if="filterCount" @click="resetForm" danger>Сбросить фильтры</Button>
                </AnimationTransition>
            </div>
        </div>
        <div v-show="extraVisible" class="form-search__extra col-12">
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
                />
                <Input
                    v-model="form.nameEng"
                    label="Название ENG"
                    placeholder="Название (Eng)"
                    class="col-md-4 col-6"
                />
            </FormGroup>
            <FormGroup class="row">
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
                <Input
                    v-model="form.dateStart"
                    label="Дата от"
                    class="col-md-2 col-6"
                    type="date"
                />
                <Input v-model="form.dateEnd" label="Дата до" class="col-md-2 col-6" type="date" />
            </FormGroup>
            <FormGroup class="row">
                <div class="col-md-8 col-12">
                    <span class="form__subtitle">Категория</span>
                    <div class="form__row mt-1">
                        <CheckboxChip
                            v-for="option in categoryOptions"
                            :key="option[0]"
                            v-model="form.categories"
                            :value="option[0]"
                            :text="$formatter.text().ucFirst(option[1])"
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
        </div>
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
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';

export default {
    name: 'FormCompanySearch',
    components: {
        RadioChip,
        CheckboxChip,
        AnimationTransition,
        Button,
        Form,
        FormGroup,
        Input,
        MultiSelect
    },
    mixins: [SearchFormMixin],
    data() {
        return {
            categoryOptions: CompanyCategories.get('param'),
            activityGroupOptions: ActivityGroupList.get('param'),
            activityProfileOptions: ActivityProfileList.get('param'),
            activePassiveOptions: ActivePassive.get('param')
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
        status: null
    },
    methods: {
        async setQueryFields() {
            this.form = { ...this.form, ...this.$route.query };
            if (this.form.categories && !Array.isArray(this.form.categories)) {
                this.form.categories = [this.form.categories];
            }
            let query = { ...this.form };
            this.deleteEmptyFields(query);
            await this.$router.replace({ query });
        }
    }
};
</script>

<style></style>
