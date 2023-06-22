<template>
  <div v-if="complex" class="ComplexView" @scroll="onScroll">
    <ComplexHeader :complex="complex" :editAccess="false"/>
    <ComplexMap :complex="complex"/>
    <ComplexAbout
        :complex="complex"
        :infrastructure="data.parameters.infrastructure"
        :railway="data.parameters.railway"
        :safety="data.parameters.safety"
    />
    <ObjectHoldings :holdings="holdings"/>
  </div>
</template>

<script>
import ObjectHoldings from "@/components/object/object-holdings/ObjectHoldings.vue";
import ComplexAbout from "@/components/object/complex-about/ComplexAbout.vue";
import ComplexMap from "@/components/object/complex-map/ComplexMap.vue";
import ComplexHeader from "@/components/object/complex-header/ComplexHeader.vue";
import data from "./object-view.data";
import "./styles.scss";
import {ComplexActionTypes} from "@/store/modules/complex/actions";
import {ComplexGettersTypes} from "@/store/modules/complex/getters";
import {mapGetters} from "vuex";

export default {
  name: "ComplexView",
  components: {ComplexHeader, ComplexMap, ComplexAbout, ObjectHoldings},
  data() {
    return {
      aboutComplexProperties: {},
      holdings: data.holdings,
      data
    };
  },
  mounted() {
    this.$store.dispatch(ComplexActionTypes.FETCH_COMPLEX, {
      complexId: 1106,
    });
  },
  computed: {
    ...mapGetters({
      complex: ComplexGettersTypes.COMPLEX
    })
  },
  methods: {},
};
</script>
