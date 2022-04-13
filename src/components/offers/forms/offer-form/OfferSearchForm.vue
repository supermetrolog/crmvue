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
    </Form>
  </div>
</template>

<script>
import Form from "@/components/common/form/Form.vue";
import FormGroup from "@/components/common/form/FormGroup.vue";
import Input from "@/components/common/form/Input.vue";
import { SearchFormMixin } from "@/components/common/mixins.js";
export default {
  mixins: [SearchFormMixin],
  name: "OfferSearchForm",
  components: {
    Form,
    FormGroup,
    Input,
  },
  data() {
    return {};
  },
  defaultFormProperties: {
    all: null,
  },
  methods: {
    async setQueryFields() {
      this.form = { ...this.form, ...this.$route.query };
      let query = { ...this.form };
      this.deleteEmptyFields(query);
      await this.$router.replace({ query });
    },
  },
};
</script>

<style>
</style>