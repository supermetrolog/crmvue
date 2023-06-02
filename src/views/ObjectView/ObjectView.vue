<template>
  <div class="ObjectView" @scroll="onScroll">
    <ObjectHeader
      :name="'СК Северное шереметьево'"
      :id="4566"
      :creation-date="'01-02-2014'"
      :updateDate="'01.01.2043'"
      :consultant="'Матвеев Павел'"
      :editAccess="false"
    />
    <ObjectMap
      :region="'Московская область'"
      :district="'Северо-восток'"
      :district-moscow="'Павловская-Слобода'"
      :direction="'Симферопольское'"
      :town="'Санкт-Петербург'"
      :highway="'Симферопольское'"
      :highway-moscow="'Киевское'"
      :metro="'Адмиралтейская'"
      :from-mkad="228"
    />
    <ObjectAbout
      :area="area"
      :communications="communications"
      :safety="safety"
      :railway="railway"
      :infrastructure="infrastructure"
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
export default {
  name: "ObjectView",
  components: { ObjectHeader, ObjectMap, ObjectAbout, ObjectHoldings },
  data() {
    return {
      ...data,
    };
  },
  computed: {},
  methods: {},
};
</script>
