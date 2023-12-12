<template>
  <div v-if="complex" class="ComplexView" @scroll="onScroll">
    <div class="ComplexHeader">
      <div class="ComplexHeader-content">
        <h1 class="ComplexHeader-name">{{ complex.title || "Нет названия" }}</h1>
        <span class="ComplexHeader-description">
        <strong>ID комплекса {{ complex.id }}, </strong>
        поступление {{ complex.publ_time }}, {{ complex.author }},
        последнее обновление {{ complex.last_update }}</span
        >
      </div>
      <div class="ComplexHeader-actions" v-if="editAccess">
        <button>
          <i class="fas fa-pen text-primary edit"></i>
        </button>
      </div>
    </div>
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
import "./styles.scss";
import { mapActions } from "vuex";

export default {
  name: "ComplexView",
  components: {ComplexMap, ComplexAbout, ObjectHoldings},
  data() {
    return {
      complex: {}
    };
  },
  async mounted() {
    this.complex = await this.fetchComplex(this.$route.params.complex_id);
  },
  methods: {
    ...mapActions({
      fetchComplex: 'FETCH_COMPLEX'
    })
  },
};
</script>
