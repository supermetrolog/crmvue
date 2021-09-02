<template>
  <div class="col-4 px-2 my-2">
    <div
      class="objects-item"
      :class="{ selected: selectedObjects.includes(object.id) }"
    >
      <div class="header">
        <div class="image">
          <span>{{ object.deal_type_name }}</span>
          <div class="icon" @click.prevent="clickUnSelectObject">
            <i class="fas fa-check"></i>
          </div>
          <a href="#" @click.prevent="clickSelectObject">
            <!-- <img src="@/assets/image/1.jpg" alt="Фото объекта" /> -->
            <img
              :src="object.photos[0]"
              alt="Фото объекта"
              v-if="mode == 'current'"
            />
            <img :src="object.building.photos" alt="Фото объекта" v-else />
          </a>
        </div>
      </div>
      <div class="body py-2 success">
        <p class="text-center title">{{ object.town_name }}</p>

        <p class="text-center mt-1 text-success_alt">| московская область |</p>
        <p class="text-center text-success_alt">| химки cевер |</p>
        <p class="text-center text-success_alt">| ленинградское |</p>
        <p class="text-center text-success_alt">| химки |</p>

        <i
          class="far fa-arrow-alt-circle-down text-center mt-1"
          @click="toggleExtraInfoVisible"
          v-if="!extraInfoVisible"
        ></i>
        <i
          class="far fa-arrow-alt-circle-up text-center mt-1"
          @click="toggleExtraInfoVisible"
          v-if="extraInfoVisible"
        ></i>
        <div class="extraFields text-center" v-if="extraInfoVisible">
          <p>адрес</p>
          <p class="text-center value">
            <!-- Россия, Москва, поселение Марушкинское, квартал № 63, дв1с2 -->
            {{ object.address }}
          </p>
          <p>площадь</p>
          <p class="value">
            {{ object.area_min }} - {{ object.area_max }} м<sup>2</sup>.
          </p>
          <p>цена за 1 м<sup>2</sup></p>
          <p class="value">
            {{ object.price_floor_min }} - {{ object.price_floor_max }} р.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ObjectsItem",
  data() {
    return {
      extraInfoVisible: false,
    };
  },
  props: {
    object: {
      type: Object,
    },
    selectedObjects: {
      type: Array,
    },
    mode: {
      type: String,
      required: true,
    },
  },
  methods: {
    toggleExtraInfoVisible() {
      this.extraInfoVisible = !this.extraInfoVisible;
    },
    clickSelectObject() {
      this.$emit("selectObject", this.object);
    },
    clickUnSelectObject() {
      this.$emit("unSelectObject", this.object);
    },
  },
  emits: ["selectObject", "unSelectObject"],
};
</script>

<style>
</style>