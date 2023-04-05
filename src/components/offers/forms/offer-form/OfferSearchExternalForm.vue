<template>
  <div class="offer-search-external-form">
    <Form class="autosize" @submit="onSubmit">
      <FormGroup class="mb-2">
        <Input
          v-model="form.all"
          label="Поиск"
          placeholder="ID, адрес, собственник, телефон, ФИО"
          class="col-4 p-0 main-input"
          @keydown.enter="onSubmit"
        />
        <Submit
          class="col-1 mt-4 ml-4"
          buttonClasses="btn filters"
          @click.prevent="$emit('openFilters')"
        >
          <i class="fas fa-filter"></i>
        </Submit>
      </FormGroup>
    </Form>
  </div>
</template>

<script>
import Submit from "@/components/common/form/Submit.vue";
import FormMixixn from "./mixins";
export default {
  components: { Submit },
  name: "OfferSearchExternalForm",
  mixins: [FormMixixn],
};
</script>

<style lang="scss">
button.filters {
  padding: 2px !important;
  padding-top: 3px !important;
  font-size: 20px;
  width: 40px;
  height: 34px;
  color: $color_dark;
  border: 1px solid $color_grey;
}
</style>
