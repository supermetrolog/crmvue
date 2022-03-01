<template>
  <div class="company-search-form">
    <Form class="autosize" @submit="onSubmit">
      <FormGroup class="mb-2 px-5">
        <Input
          v-model="form.all"
          label="Поиск"
          placeholder="название компании, ID компании, ФИО брокера, ФИО контакта, телефон"
          class="col-12 main-input pr-1"
          @keydown.enter="onSubmit"
        />
      </FormGroup>
      <FormGroup class="px-5">
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
      </FormGroup>

      <div v-show="extraVisible">
        <FormGroup class="mb-1 px-5">
          <MultiSelect
            v-model="form.consultant_id"
            label="Консультант"
            class="col-4 pr-1"
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
            class="col-4 pr-1"
          />
          <Input
            v-model="form.nameEng"
            label="Название ENG"
            placeholder="название eng"
            class="col-4"
          />
        </FormGroup>
        <FormGroup class="mb-1 px-5">
          <MultiSelect
            v-model="form.activityGroup"
            title="Группа деятельности"
            label="Группа дея-ти"
            class="col-4 pr-1"
            :options="activityGroupOptions"
          />
          <MultiSelect
            v-model="form.activityProfile"
            title="Профиль деятельности"
            label="Профиль дея-ти"
            class="col-4 pr-1"
            :options="activityProfileOptions"
          />
          <Input
            v-model="form.dateStart"
            label="Дата от"
            class="col-2 pr-1"
            type="date"
          />
          <Input
            v-model="form.dateEnd"
            label="Дата до"
            class="col-2"
            type="date"
          />
        </FormGroup>
        <FormGroup class="px-5">
          <Checkbox
            v-model="form.categories"
            :options="categoryOptions"
            label="Категория"
            class="col-8 pr-1"
          />
          <Radio
            v-model="form.status"
            :options="activePassiveOptions"
            :unselectMode="true"
            label="Статус"
            class="col-2 pr-1"
          />
          <div class="col-2 align-self-center">
            <button
              class="btn btn-warning btn-large"
              @click.prevent="resetForm"
            >
              Сбросить
            </button>
          </div>
        </FormGroup>
      </div>
    </Form>
  </div>
</template>

<script>
import Form from "@/components/common/form/Form.vue";
import FormGroup from "@/components/common/form/FormGroup.vue";
import Input from "@/components/common/form/Input.vue";
import MultiSelect from "@/components/common/form/MultiSelect.vue";
import Checkbox from "@/components/common/form/Checkbox.vue";
import Radio from "@/components/common/form/Radio.vue";
import { mapActions, mapGetters } from "vuex";
import {
  CompanyCategories,
  ActivityGroupList,
  ActivityProfileList,
  ActivePassive,
} from "@/const/Const.js";
const defaultFormProperties = {
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
};
export default {
  name: "CompanySearchForm",
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
      setTimeout: null,
      categoryOptions: CompanyCategories.get("param"),
      activityGroupOptions: ActivityGroupList.get("param"),
      activityProfileOptions: ActivityProfileList.get("param"),
      activePassiveOptions: ActivePassive.get("param"),
      extraVisible: false,
      form: { ...defaultFormProperties },
    };
  },
  computed: {
    ...mapGetters(["THIS_USER"]),
    filterCount() {
      let count = 0;
      for (const key in defaultFormProperties) {
        if (Object.hasOwnProperty.call(this.form, key)) {
          const value = this.form[key];
          if (value !== null && value !== "") {
            if (Array.isArray(value)) {
              if (value.length) {
                count++;
              }
            } else {
              count++;
            }
          }
        }
      }
      return count;
    },
  },
  methods: {
    ...mapActions(["FETCH_CONSULTANT_LIST"]),
    onSubmit() {
      let query = { ...this.$route.query, ...this.form };

      this.deleteEmptyFields(query);

      query.page = 1;
      this.$router.push({ query });
    },
    resetForm() {
      this.form = { ...defaultFormProperties };
    },
    deleteEmptyFields(object) {
      for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
          const value = object[key];
          if (
            value === null ||
            value === "" ||
            (Array.isArray(value) && !value.length)
          ) {
            delete object[key];
          }
        }
      }
    },
    async setQueryFields() {
      this.form = { ...this.form, ...this.$route.query };
      if (this.form.categories && !Array.isArray(this.form.categories)) {
        this.form.categories = [this.form.categories];
      }
      let query = { ...this.form };
      this.deleteEmptyFields(query);
      await this.$router.push({ query });
    },
  },
  async mounted() {
    await this.setQueryFields();
    this.$watch(
      "form",
      () => {
        clearTimeout(this.setTimeout);
        this.setTimeout = setTimeout(() => this.onSubmit(), 500);
      },
      { deep: true }
    );
  },
  beforeUnmount() {
    console.log("UNMOUNT");
    clearTimeout(this.setTimeout);
  },
};
</script>

<style>
</style>