<template>
  <div class="company-objects-list__item" :class="col">
    <div class="row no-gutters">
      <div class="col-4">
        <div class="image-container">
          <img :src="imageSrc" alt="image" />
        </div>
      </div>
      <div class="col-8 p-1">
        <div class="item__title">
          <p>ID-{{ object.id }}</p>
          <p>{{ $formatter.number(object.area_building) }} м<sup>2</sup></p>
        </div>
        <div class="address">
          <p>{{ object.address }}</p>
        </div>
        <div class="params">
          <div class="params__item">
            <p class="title">Этажи:</p>
            <p class="value">{{ object.floors }}</p>
          </div>
          <div class="params__item">
            <p class="title">Потолки:</p>
            <p class="value">{{ object.floors }}</p>
          </div>
        </div>
        <div class="params">
          <div class="params__item">
            <p class="title">Электричество:</p>
            <p class="value">
              {{ $formatter.number(object.power) }} <small>кВт</small>
            </p>
          </div>
          <div class="params__item">
            <p class="title">Тип ворот:</p>
            <p class="value">{{ object.floors }}</p>
          </div>
        </div>
      </div>
    </div>
    <hr />
  </div>
</template>

<script>
export default {
  name: "CompanyObjectItem",
  props: {
    object: {
      type: Object,
    },
    col: {
      type: String,
      default: "col-12",
    },
  },
  computed: {
    imageSrc() {
      const photo = this.object.photo;
      if (photo && Array.isArray(photo)) {
        return "https://pennylane.pro" + photo[0];
      }
      return "http://crmka/uploads/1.jpg";
    },
  },
};
</script>

<style>
</style>