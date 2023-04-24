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
        <div class="col-3 align-self-center pt-3">
          <a
              :href="$router.resolve({name: 'OffersMain', query: $route.query}).href"
              class="btn btn-light p-3">
            <i class="fas fa-list"></i>
            <span class="ml-1" v-if="offersCount">{{offersCount}} ({{objectsCount}})</span> Предложений списком
          </a>
        </div>
        <div class="col-2 align-self-end pt-3">
          <div class="row no-gutters">
            <div class="col-12">
              <a
                  href="#"
                  @click.prevent="resetForm"
                  class="text-primary"
                  v-if="filterCount"
              >
                <i class="fas fa-heart"></i>
                Сохранить поиск
              </a>
            </div>
            <div class="col-12">
              <a
                  href="#"
                  @click.prevent="resetForm"
                  class="text-danger"
                  v-if="filterCount"
              >
                <i class="fas fa-times-circle"></i>
                Сбросить фильтры
              </a>
            </div>
          </div>
        </div>
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
  props: {
      offersCount: {
        type: Number,
        default: 0
      }
  },
  methods: {
    changeLocationToList() {
      this.$router.push({name: 'OffersMain', query: this.$route.query});
    }
  },
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
