<template>
  <div class="ObjectView" @scroll="onScroll">
    <ObjectHeader
      :editAccess="false"
      :complex="complex"
    />
    <ObjectMap
      :address="splittedAddress"
      :metro="complex.metro"
      :from-mkad="complex.from_mkad"
      :coords="copmlexCoords"
    />
    <!-- <ObjectMap
      :region="'Московская область'"
      :district="'Северо-восток'"
      :district-moscow="'Павловская-Слобода'"
      :direction="'Симферопольское'"
      :town="'Санкт-Петербург'"
      :highway="'Симферопольское'"
      :highway-secondary="'Киевское'"
      :village="''"
      :metro="complex.metro"
      :from-mkad="complex.from_mkad"
    /> -->
    <ObjectAbout
      :area="aboutComplexProperties.area"
      :communications="aboutComplexProperties.communications"
      :safety="aboutComplexProperties.safety"
      :railway="aboutComplexProperties.railway"
      :infrastructure="aboutComplexProperties.infrastructure"
    />
    <ObjectHoldings :holdings="holdings" />
  </div>
</template>

<script>
import ObjectHoldings from "@/components/object/object-holdings/ObjectHoldings.vue";
import ObjectAbout from "@/components/object/object-about/ObjectAbout.vue";
import ObjectMap from "@/components/object/object-map/ObjectMap.vue";
import ObjectHeader from "@/components/object/object-header/ObjectHeader.vue";
import data from "./object-view.data";
import "./styles.scss";
import { ComplexActionTypes } from "@/store/modules/complex/actions";
import { ComplexGettersTypes } from "@/store/modules/complex/getters";
export default {
  name: "ObjectView",
  components: { ObjectHeader, ObjectMap, ObjectAbout, ObjectHoldings },
  data() {
    return {
      aboutComplexProperties: {},
      holdings: data.holdings,
      complex: {},
    };
  },
  async mounted() {
    await this.$store.dispatch(ComplexActionTypes.FETCH_COMPLEX, {
      complexId: 1106,
    });
    this.complex = this.$store.getters[ComplexGettersTypes.COMPLEX];
  },
  computed: {
    splittedAddress() {
      return this.complex?.address?.split(", ").filter((el) => isNaN(+el));
    },
    copmlexCoords() {
      return [this.complex.latitude, this.complex.longitude];
    },
  },
  methods: {},
};
</script>
