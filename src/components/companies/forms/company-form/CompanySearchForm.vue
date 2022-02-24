<template>
  <div class="company-search-form">
    <Form class="autosize" @submit="onSubmit">
      <FormGroup class="mb-2">
        <Input
          v-model="form.all"
          placeholder="название компании, ID компании, ФИО брокера, ФИО контакта, телефон"
          class="col-10 main-input pr-1"
          @keydown.enter="onSubmit"
        />
        <Submit
          class="col-1 ml-auto align-self-center"
          buttonClasses="btn-primary"
        >
          поиск
        </Submit>
      </FormGroup>
      <FormGroup>
        <MultiSelect
          v-model="form.consultant_id"
          label="Консультант"
          class="col-3 pr-1"
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
          class="col-3 pr-1"
        />
        <Input
          v-model="form.nameEng"
          label="Название ENG"
          placeholder="название eng"
          class="col-3"
        />
      </FormGroup>
      <FormGroup>
        <Checkbox
          v-model="form.categories"
          :options="categoryOptions"
          label="Категория"
          class="col-3"
        />
        <MultiSelect
          v-model="form.activityGroup"
          title="Группа деятельности"
          label="Группа дея-ти"
          class="col-3 pr-1"
          :options="activityGroupOptions"
        />
        <MultiSelect
          v-model="form.activityProfile"
          title="Профиль деятельности"
          label="Профиль дея-ти"
          class="col-3"
          :options="activityProfileOptions"
        />
      </FormGroup>
      <FormGroup>
        <Input
          v-model="form.dateStart"
          label="Дата от"
          class="col-3 pr-1"
          type="date"
        />
        <Input
          v-model="form.dateEnd"
          label="Дата до"
          class="col-3"
          type="date"
        />
      </FormGroup>
    </Form>
  </div>
</template>

<script>
import Form from "@/components/common/form/Form.vue";
import FormGroup from "@/components/common/form/FormGroup.vue";
import Input from "@/components/common/form/Input.vue";
import Submit from "@/components/common/form/Submit.vue";
import MultiSelect from "@/components/common/form/MultiSelect.vue";
import Checkbox from "@/components/common/form/Checkbox.vue";
import { mapActions, mapGetters } from "vuex";
import {
  CompanyCategories,
  ActivityGroupList,
  ActivityProfileList,
} from "@/const/Const.js";
export default {
  name: "CompanySearchForm",
  components: {
    Form,
    FormGroup,
    Input,
    Submit,
    MultiSelect,
    Checkbox,
  },
  data() {
    return {
      setTimeout: null,
      categoryOptions: CompanyCategories.get("param"),
      activityGroupOptions: ActivityGroupList.get("param"),
      activityProfileOptions: ActivityProfileList.get("param"),
      form: {
        all: null,
        nameRu: null,
        nameEng: null,
        consultant_id: null,
        categories: [],
        activityGroup: null,
        activityProfile: null,
        dateStart: null,
        dateEnd: null,
      },
    };
  },
  computed: {
    ...mapGetters(["THIS_USER"]),
  },
  methods: {
    ...mapActions(["FETCH_CONSULTANT_LIST"]),
    onSubmit() {
      let query = { ...this.$route.query, ...this.form };

      this.deleteEmptyFields(query);

      query.page = 1;
      console.log(query);
      this.$router.push({ query });
    },

    deleteEmptyFields(object) {
      for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
          const value = object[key];
          if (value === null || value === "") {
            delete object[key];
          }
        }
      }
    },
    setQueryFields() {
      const queryLength = Object.keys(this.$route.query).length;
      if (!queryLength) {
        this.form.consultant_id = this.THIS_USER.id;
      }
      this.form = { ...this.form, ...this.$route.query };
      let query = { ...this.form };
      this.deleteEmptyFields(query);
      this.$router.push({ query });
    },
  },
  mounted() {
    this.setQueryFields();
  },
  watch: {
    form: {
      deep: true,
      handler() {
        clearTimeout(this.setTimeout);
        this.setTimeout = setTimeout(() => this.onSubmit(), 300);
      },
    },
  },
};
</script>

<style>
</style>