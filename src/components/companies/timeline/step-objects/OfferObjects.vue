<template>
  <div class="offer-objects">
    <div class="row no-gutters mb-3 p-0">
      <div class="col-3 pr-1">
        <button
          class="btn btn-primary btn-large"
          @click.prevent="$emit('sendObjects')"
        >
          отправить
        </button>
      </div>
      <div class="col-4 pr-1">
        <button
          class="btn btn-warning btn-large"
          @click.prevent="$emit('clickResetSelectObjects')"
        >
          сбросить выделение
        </button>
      </div>
      <div class="col-3 pr-1">
        <button
          class="btn btn-dark btn-large"
          @click.prevent="$emit('clickFavoritesVisibleToggle')"
          v-if="!favoritesVisible"
        >
          избранное
          <span class="text-success">{{ selectedObjects.length }}</span>
        </button>
        <button
          class="btn btn-dark btn-large"
          @click.prevent="$emit('clickFavoritesVisibleToggle')"
          v-else
        >
          левая
        </button>
      </div>
    </div>
    <div class="row no-gutters inner scroller">
      <div class="col-12">
        <Loader class="center" v-if="loader" />

        <div class="row no-gutters" v-if="allObjects.length">
          <div class="col-12 px-2" v-if="currentStepObjects.length">
            <p>Отправленные предложения</p>
          </div>
          <ObjectsItem
            v-for="object in currentStepObjects"
            :object="object"
            :selectedObjects="selectedObjects"
            :key="object.id"
            :classList="'success'"
            @selectObject="$emit('selectObject', object)"
            @unSelectObject="$emit('unSelectObject', object)"
          />
          <div class="col-12 px-2 mt-3">
            <hr />
            <p>Все предложения</p>
          </div>

          <ObjectsItem
            v-for="object in allObjects"
            :object="object"
            :selectedObjects="selectedObjects"
            :key="object.id"
            :classList="
              currentStepObjects.find((item) => item.id == object.id)
                ? 'success'
                : ''
            "
            @selectObject="$emit('selectObject', object)"
            @unSelectObject="$emit('unSelectObject', object)"
          />
          <div class="col-12 text-center">
            <Pagination
              :pagination="pagination"
              @loadMore="$emit('loadMore')"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ObjectsItem from "@/components/companies/objects/ObjectsItem.vue";
import Pagination from "@/components/Pagination";

import Loader from "@/components/Loader";
export default {
  name: "OfferObjects",
  components: {
    ObjectsItem,
    Pagination,
    Loader,
  },
  props: {
    loader: {
      type: Boolean,
    },
    pagination: {
      type: Object,
    },
    favoritesVisible: {
      type: [Boolean, Number],
      default() {
        return null;
      },
    },
    selectedObjects: {
      type: Array,
      default() {
        return [];
      },
    },
    currentStepObjects: {
      type: Array,
      default() {
        return [];
      },
    },
    allObjects: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  emits: [
    "sendObjects",
    "clickResetSelectObjects",
    "clickFavoritesVisibleToggle",
    "selectObject",
    "unSelectObject",
    "loadMore",
  ],
};
</script>

<style>
</style>