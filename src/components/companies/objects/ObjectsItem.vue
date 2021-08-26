<template>
  <div class="col-4 px-2">
    <div
      class="objects-item"
      :class="{ selected: object.id == selectedObjectId }"
    >
      <div class="header">
        <div class="image">
          <span>Продажа</span>
          <div class="icon">
            <i class="fas fa-check"></i>
          </div>
          <a href="#" @click.prevent="clickSelectObject">
            <!-- <img src="@/assets/image/1.jpg" alt="Фото объекта" /> -->
            <img
              src="https://pennylane.pro/uploads/objects/2842/2.jpg"
              alt="Фото объекта"
            />
          </a>
        </div>
      </div>
      <div class="body py-2 success">
        <p class="text-center title">Logistic Partners</p>

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
          <p class="mt-1 text-center text-success_alt">
            Россия, Москва, поселение Марушкинское, квартал № 63, дв1с2
          </p>
          <p>площадь</p>
          <small>25 000 - 150 000 м2.</small>
          <p>цена за 1 м2</p>
          <small>25 000 - 150 000 р.</small>
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
    selectedObjectId: {
      type: Number,
    },
  },
  methods: {
    toggleExtraInfoVisible() {
      this.extraInfoVisible = !this.extraInfoVisible;
    },
    clickSelectObject() {
      this.$emit("selectObject", this.object);
    },
  },
};
</script>

<style>
</style>