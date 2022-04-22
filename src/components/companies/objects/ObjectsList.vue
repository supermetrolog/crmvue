<template>
  <div class="objects-list row no-gutters">
    <div class="col-12 px-2" v-if="label">
      <h4>{{ label }}</h4>
    </div>
    <div class="col-4 mx-auto" v-if="!objects.length && !loader">
      <h3 class="text-warning text-center">НЕТ ДАННЫХ</h3>
    </div>
    <Loader class="center" v-if="loader" />
    <component
      :is="currentComponent"
      v-for="object in objects"
      :disabled="disabled"
      :offer="object"
      :isSelected="!!selectedObjects.find((item) => item.id == object.id)"
      :key="object.id"
      :col="col"
      :classList="
        currentObjects.find(
          (item) =>
            item.object_id == object.object_id && item.type_id == object.type_id
        )
          ? 'success'
          : ''
      "
      @select="$emit('select', $event)"
      @unSelect="$emit('unSelect', $event)"
      @addComment="(...argv) => this.$emit('addComment', ...argv)"
    />
    <!-- <ObjectsItem
      v-for="object in objects"
      :disabled="disabled"
      :object="object"
      :isSelected="!!selectedObjects.find((item) => item.id == object.id)"
      :key="object.id"
      :col="col"
      :classList="
        currentObjects.find((item) => item.object_id == object.original_id)
          ? 'success'
          : ''
      "
      @select="$emit('select', $event)"
      @unSelect="$emit('unSelect', $event)"
      @addComment="(...argv) => this.$emit('addComment', ...argv)"
    /> -->
    <hr v-if="withSeparator && !loader" />
  </div>
</template>

<script>
import ObjectsItem from "./ObjectsItem.vue";
import CompanyObjectItemOfferOnly from "./company-objects/CompanyObjectItemOfferOnly.vue";
import ObjectsItemTable from "./ObjectsItemTable.vue";
export default {
  name: "ObjectsList",
  emits: ["select", "unSelect", "addComment"],
  components: {
    ObjectsItem,
    ObjectsItemTable,
    CompanyObjectItemOfferOnly,
  },
  data() {
    return {};
  },
  props: {
    objects: {
      type: [Array, Boolean],
      default: () => [],
    },
    selectedObjects: {
      type: Array,
      default: () => [],
    },
    currentObjects: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    selectOnlyOne: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: null,
    },
    withSeparator: {
      type: Boolean,
      default: false,
    },
    loader: {
      type: Boolean,
      default: false,
    },
    col: {
      type: String,
      default: "col-4",
    },
    viewMode: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    currentComponent() {
      console.log(this.viewMode);
      if (this.viewMode) {
        return "CompanyObjectItemOfferOnly";
      }
      return "CompanyObjectItemOfferOnly";
    },
  },
  methods: {
    addComment(object, comment) {
      this.$emit("addComment", object, comment);
    },
  },
};
</script>

<style>
</style>