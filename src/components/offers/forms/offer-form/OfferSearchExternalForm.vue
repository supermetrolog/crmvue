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
          <span class="badge badge-danger" v-if="filterCount">
            {{filterCount}}
          </span>
          <i class="fas fa-sliders-h"></i>
        </Submit>
      </FormGroup>
    </Form>
  </div>
</template>

<script>
import Submit from "@/components/common/form/Submit.vue";
import FormMixixn from "./mixins";
import { waitHash } from "@/utils";
export default {
  components: { Submit },
  name: "OfferSearchExternalForm",
  mixins: [FormMixixn],
  watch: {
    "$route.query": function (newQuery, oldQuery) {
      if (waitHash(newQuery) !== waitHash(oldQuery)){
        this.setDefaultFields();
        this.setQueryFields();
      }
    }
  }
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
  position: relative;
  border-radius: 4px;
  span.badge {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 25px;
    height: 25px;
    top: -13px;
    right: -13px;
    border-radius: 50%;
    font-size: 15px;
    font-weight: bold;
    border: 2px solid $color_light;
  }
}
</style>
