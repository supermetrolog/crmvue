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
    </div>
    <div class="row no-gutters inner scroller">
      <div class="col-12">
        <Loader class="center" v-if="loader" />

        <div class="row no-gutters" v-if="allObjects.length">
          <div class="col-12 px-2" v-if="currentStepObjects.length">
            <p v-if="selectedStepNumber == 2">
              Предложения, которые заинтересовали клиента
            </p>
            <p v-else-if="selectedStepNumber == 3">
              Оъекты, которые планируются осмотреть
            </p>
            <p v-else-if="selectedStepNumber == 4">Оъекты, которые осмотрели</p>
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
            <p v-if="selectedStepNumber == 2">Отправленные предложения</p>
            <p v-else-if="selectedStepNumber == 3">
              Предложения, которые заинтересовали клиента
            </p>
            <p v-else-if="selectedStepNumber == 4">
              Объекты, которые планировалось осмотреть
            </p>
          </div>

          <ObjectsItem
            v-for="object in allObjects"
            :object="object"
            :selectedObjects="selectedObjects"
            :key="object.id"
            @selectObject="$emit('selectObject', object)"
            @unSelectObject="$emit('unSelectObject', object)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ObjectsItem from "@/components/companies/objects/ObjectsItem.vue";

import Loader from "@/components/Loader";
export default {
  name: "DefaultObjects",
  components: {
    ObjectsItem,
    Loader,
  },
  props: {
    loader: {
      type: Boolean,
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
    selectedStepNumber: {
      type: Number,
    },
  },
  emits: [
    "sendObjects",
    "clickResetSelectObjects",
    "selectObject",
    "unSelectObject",
  ],
};
</script>

<style>
</style>