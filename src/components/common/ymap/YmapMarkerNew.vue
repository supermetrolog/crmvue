<template>
  <div></div>
</template>

<script>
export default {
  name: "YmapMarkerNew",
  data() {
    return {
      geoObject: null,
    };
  },
  inject: ["add", "remove"],
  props: {
    coords: {
      type: Array,
      required: true,
    },
    markerId: {
      type: [Number, String],
      required: true,
    },
    balloonContentBody: String,
    balloonContentHeader: String,
    balloonContentFooter: String,
  },
  geoObjects: [],
  mounted() {
    this.createGeoObject();
  },
  beforeUnmount() {
    this.removeGeoObject();
  },

  methods: {
    createGeoObject() {
      //   const geoObject = new window.ymaps.GeoObject({
      //     geometry: {
      //       type: "Point", // тип геометрии - точка
      //       coordinates: this.coords, // координаты точки
      //     },
      //     hideIcon: false,
      //     properties: {
      //       balloonContentHeader: "Заголовок",
      //       balloonContentBody: "Содержимое",
      //       balloonContentFooter: "Подвал",
      //       hintContent: "Подсказка",
      //       iconLayout: "default#image",
      //       iconImageHref: "/map.png",
      //       iconImageSize: [30, 44],
      //       iconImageOffset: [-15, -44],
      //     },
      //   });

      const marker = {
        type: "Feature",
        id: this.markerId,
        geometry: { type: "Point", coordinates: this.coords },
        properties: {
          balloonContentHeader: this.balloonContentHeader,
          balloonContentBody: this.balloonContentBody,
          balloonContentFooter: this.balloonContentFooter,
        },
      };

      this.$options.geoObjects.push(marker);

      this.add(marker);
    },
    removeGeoObject() {
      const thisGeoObject = this.$options.geoObjects.find(
        (o) => o.id === this.markerId
      );
      if (this.$options.geoObjects && thisGeoObject) {
        this.remove(thisGeoObject);
        this.$options.geoObjects = this.$options.geoObjects.filter(
          (o) => o.id !== this.markerId
        );
      }
    },
  },
};
</script>

<style>
</style>