<template>
  <div class="row no-gutters objects">
    <div class="col-12 px-2" v-if="currentStepObjects.length">
      <p>Отправленные предложения</p>
    </div>
    <ObjectsItem
      v-for="object in currentStepObjects"
      :object="object"
      :selectedObjects="selectedObjects"
      :key="object.id"
      mode="current"
      @selectObject="selectObject"
      @unSelectObject="unSelectObject"
    />
    <div class="col-12 px-2 mt-4">
      <p>Все предложения</p>
    </div>
    <ObjectsItem
      v-for="object in allObjects"
      :object="object"
      :selectedObjects="selectedObjects"
      :key="object.id"
      mode="all"
      @selectObject="selectObject"
      @unSelectObject="unSelectObject"
    />
  </div>
</template>

<script>
import ObjectsItem from "./ObjectsItem.vue";
export default {
  name: "Objects",
  components: {
    ObjectsItem,
  },
  data() {
    return {
      selectedObjects: [],
    };
  },
  props: {
    currentStepObjects: {
      type: Array,
    },
    allObjects: {
      type: Array,
    },
  },
  methods: {
    selectObject(object) {
      this.selectedObjects.push(object.id);
    },
    unSelectObject(object) {
      this.selectedObjects = this.selectedObjects.filter(
        (id) => id != object.id
      );
    },
  },
};
</script>

<style>
</style>