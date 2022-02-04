<template>
  <div class="objects-search-input">
    <Form @submit="onSubmit">
      <FormGroup>
        <Input
          v-model="form.searchText"
          label="Поиск предложений"
          class="col-10 pl-2"
          @keyup.enter="onSubmit"
          placeholder="ID, город, направление, округ, район, шоссе, метро, название СК, тип помещения"
        />
        <Submit
          class="col-2 align-self-end pl-4 pr-2"
          :buttonClasses="'btn-primary'"
        >
          поиск
        </Submit>
      </FormGroup>
    </Form>
  </div>
</template>

<script>
import Form from "@/components/form/Form";
import FormGroup from "@/components/form/FormGroup";
import Input from "@/components/form/Input";
import Submit from "@/components/form/Submit";
export default {
  name: "ObjectsSearch",
  components: {
    Form,
    FormGroup,
    Input,
    Submit,
  },
  data() {
    return {
      form: {
        searchText: "",
      },
    };
  },
  methods: {
    onSubmit() {
      this.$emit("search", { query: this.form });
    },
  },
};
</script>

<style>
.objects-search-input .form-container {
  width: 100%;
}
</style>