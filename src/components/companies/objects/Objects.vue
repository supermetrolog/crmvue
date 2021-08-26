<template>
  <div class="row no-gutters objects">
    <ObjectsItem
      v-for="object in objects"
      :object="object"
      :selectedObjectId="selectedObject.id"
      :key="object.id"
      @selectObject="selectObject"
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
      selectedObject: false,
    };
  },
  props: {
    objects: {
      type: Object,
    },
  },
  methods: {
    selectObject(object) {
      this.selectedObject = object;
      console.error(this.selectedObject);
    },
  },
};
</script>

<style>
</style>