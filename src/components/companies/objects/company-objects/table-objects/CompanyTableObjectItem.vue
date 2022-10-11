<template>
  <div class="company-objects-list__item" :class="col">
    <div class="row no-gutters">
      <div class="col-4" :title="object.description_auto || 'нет описания'">
        <div class="image-container">
          <a :href="objectUrl" target="_blank">
            <img :src="imageSrc" alt="image" />
          </a>
        </div>
      </div>
      <div class="col-6 desc row">
        <div class="col-6">
          <div class="item__title">
            <p>{{ $formatter.number(object.area_building) }} м<sup>2</sup></p>
            <span>{{ object.object_class }}</span>
          </div>
          <div class="address">
            <p>{{ object.address }}</p>
          </div>
        </div>
        <div class="col-6" v-if="this.object.offerMix">
          <CompanyTableObjectOffer
            v-for="offer in this.object.offerMix.filter(
              (offer) => offer.status == 1
            )"
            :key="offer.id"
            :offer="offer"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CompanyTableObjectOffer from "./CompanyTableObjectOffer.vue";
export default {
  name: "CompanyTableObjectItem",
  components: {
    CompanyTableObjectOffer,
  },
  props: {
    object: {
      type: Object,
    },
    col: {
      type: String,
      default: "col-6",
    },
  },
  computed: {
    imageSrc() {
      const photo = this.object.photo;
      if (photo && Array.isArray(photo)) {
        return "https://pennylane.pro" + photo[0];
      }
      return this.$apiUrlHelper.fileNotFoundUrl();
    },

    objectUrl() {
      return "https://pennylane.pro/complex/" + this.object.complex_id;
    },
  },
};
</script>