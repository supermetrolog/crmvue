<template>
  <div class="offer-search-external-form">
    <Form class="autosize" @submit="onSubmit">
      <FormGroup class="mb-2 formgroup d-flex">
        <Input
          v-model="form.all"
          label="Поиск"
          placeholder="ID, адрес, собственник, телефон, ФИО"
          class="main-input col-5"
          @keydown.enter="onSubmit"
        >
          <div>
            <a
                href="#"
                @click.prevent="clickFavorites"
                class="mini"
                :class="{ 'text-warning': !form.favorites, 'bg-warning text-light': form.favorites}"
            >
              <i class="fas fa-star"></i>
              Избранные
            </a>
            <a
                href="#"
                @click.prevent
                class="mini"
                :class="{'text-dark': !filterCount, 'text-primary': filterCount}"
            >
              <i class="fas fa-heart"></i>
              Сохранить поиск
            </a>
            <a
                href="#"
                @click.prevent="resetForm"
                class="mini"
                :class="{'text-dark': !filterCount, 'text-danger': filterCount}"
            >
              <i class="fas fa-times-circle"></i>
              Сбросить фильтры
            </a>
          </div>
          
        </Input>
        <Submit
          buttonClasses="btn filters"
          @click.prevent="$emit('openFilters')"
        >
          <span class="badge badge-danger" v-if="filterCount">
            {{filterCount}}
          </span>
          <i class="fas fa-sliders-h"></i>
        </Submit>
        <div>
          <a
              :href="$router.resolve({name: isMap ? 'OffersMain' : 'OffersMap', query: $route.query}).href"
              class="btn btn-light list"
          >
            <i v-if="isMap" class="fas fa-list mr-1"></i>
            <i v-else class="fas fa-map mr-1"></i>
            {{isMap ? 'Списком' : 'На карте'}}
            <span v-if="isMap" class="ml-1">{{offersCount}} ({{objectsCount}})</span>
            <span v-else class="ml-1">{{offersCount ?? objectsCount}}</span>
          </a>
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
      },
    isMap: {
        type: Boolean,
      default: false
    }
  },
  methods: {
    clickFavorites() {
      if (this.form.favorites) {
        this.form.favorites = null;
      } else {
        this.form.favorites = 1;
      }
    },
  },
  watch: {
    "$route.query": function (newQuery, oldQuery) {
      delete newQuery.page;
      delete oldQuery.page;
      if (waitHash(newQuery) !== waitHash(oldQuery)){
        this.setDefaultFields();
        this.setQueryFields();
      }
    }
  }
};
</script>

<style lang="scss">
a.btn.list {
  display: flex;
  justify-content: left;
  align-items: center;
  height: 34px;
  text-transform: capitalize;
}
a.mini {
  margin: 0 3px;
}
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

.formgroup {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
</style>
