<template>
  <div v-if="complex" class="ComplexView" @scroll="onScroll">
    <ComplexHeader :complex="complex" :editAccess="false"/>
    <ComplexMap :complex="complex"/>
    <ComplexAbout
      :complex="complex"
    />
    <ObjectHoldings :objects="complex.objects"/>
  
  </div>
</template>

<script>

import ObjectHoldings from "@/components/complex/object-holdings/ObjectHoldings.vue";
import ComplexAbout from "@/components/complex/complex-about/ComplexAbout.vue";
import ComplexMap from "@/components/complex/complex-map/ComplexMap.vue";
import ComplexHeader from "@/components/complex/complex-header/ComplexHeader.vue";
import "./styles.scss";
import {ComplexActionTypes} from "@/store/modules/complex/actions";
import { toRaw } from 'vue';

export default {
  name: "ComplexView",
  components: {ComplexHeader, ComplexMap, ComplexAbout, ObjectHoldings},
  data() {
    return {};
  },
  
  computed: {
    complex() {
      return this.$store.getters.complex;
    },
  },
  methods: {},

  async mounted() {
     await this.$store.dispatch(ComplexActionTypes.FETCH_COMPLEX, {
      complexId: 2273,
    });
    console.log(toRaw(this.complex));
    } 
};
</script>
