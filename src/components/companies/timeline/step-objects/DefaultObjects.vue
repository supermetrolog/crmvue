<template>
  <div class="offer-objects">
    <div class="row no-gutters mb-3 p-0">
      <div class="col-3 pr-1">
        <button
          class="btn btn-primary btn-large"
          @click.prevent="$emit('sendObjects')"
        >
          Подтвердить
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
      <div class="col-8">
        <slot></slot>
      </div>
      <div class="col-4 text-right companies-actions">
        <p class="d-inline">Вид:</p>
        <button
          class="btn btn-action text-dark"
          :class="{ active: !viewMode }"
          @click="viewMode = false"
        >
          <i class="fas fa-th-list"></i>
        </button>
        <button
          class="btn btn-action text-primary"
          :class="{ active: viewMode }"
          @click="viewMode = true"
        >
          <i class="fas fa-th"></i>
        </button>
      </div>

      <div class="col-12">
        <Loader class="center" v-if="loader" />

        <div class="row no-gutters" v-if="allObjects.length">
          <div class="col-12 px-2" v-if="currentStepObjects.length">
            <p v-if="selectedStepNumber == 2">
              Предложения, которые заинтересовали клиента
              <strong v-if="currentStepObjects.length"
                >({{ currentStepObjects.length }})</strong
              >
            </p>
            <p v-else-if="selectedStepNumber == 3">
              Объекты, которые планируются осмотреть
              <strong v-if="currentStepObjects.length"
                >({{ currentStepObjects.length }})</strong
              >
            </p>
            <p v-else-if="selectedStepNumber == 4">
              Оъекты, которые осмотрели
              <strong v-if="currentStepObjects.length"
                >({{ currentStepObjects.length }})</strong
              >
            </p>
            <p v-else-if="selectedStepNumber == 5">
              Оъекты, которые заинтересовали клиента при осмотра
              <strong v-if="currentStepObjects.length"
                >({{ currentStepObjects.length }})</strong
              >
            </p>
            <p v-else-if="selectedStepNumber == 6">
              Оъекты, по которым клиент планирует вести переговоры
              <strong v-if="currentStepObjects.length"
                >({{ currentStepObjects.length }})</strong
              >
            </p>
          </div>
          <template v-if="viewMode">
            <ObjectsItem
              v-for="object in currentStepObjects"
              :object="object"
              :selectedObjects="selectedObjects"
              :key="object.id"
              :classList="'success'"
              :col="!stepActionsPartVisible ? 'col-3' : 'col-4'"
              @selectObject="$emit('selectObject', object)"
              @unSelectObject="$emit('unSelectObject', object)"
            />
          </template>
          <template v-else>
            <div class="company-table-view">
              <table>
                <tbody>
                  <ObjectsItemTable
                    v-for="object in currentStepObjects"
                    :object="object"
                    :selectedObjects="selectedObjects"
                    :key="object.id"
                    :classList="'success'"
                    @selectObject="$emit('selectObject', object)"
                    @unSelectObject="$emit('unSelectObject', object)"
                  />
                </tbody>
              </table>
            </div>
          </template>

          <div class="col-12 px-2 mt-3">
            <hr />
            <p v-if="selectedStepNumber == 2">Отправленные предложения</p>
            <p v-else-if="selectedStepNumber == 3">
              Предложения, которые заинтересовали клиента
            </p>
            <p v-else-if="selectedStepNumber == 4">
              Объекты, которые планировалось осмотреть
            </p>
            <p v-else-if="selectedStepNumber == 5">
              Объекты, которые были осмотрены
            </p>
            <p v-else-if="selectedStepNumber == 6">
              Объекты, которые заинтересовали клиента при осмотре
            </p>
          </div>
          <template v-if="viewMode">
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
              :col="!stepActionsPartVisible ? 'col-3' : 'col-4'"
              @selectObject="$emit('selectObject', object)"
              @unSelectObject="$emit('unSelectObject', object)"
            />
          </template>
          <template v-else>
            <div class="company-table-view">
              <table>
                <tbody>
                  <ObjectsItemTable
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
                </tbody>
              </table>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ObjectsItem from "@/components/companies/objects/ObjectsItem.vue";
import ObjectsItemTable from "@/components/companies/objects/ObjectsItemTable.vue";

import Loader from "@/components/Loader";
export default {
  name: "DefaultObjects",
  components: {
    ObjectsItem,
    ObjectsItemTable,
    Loader,
  },
  data() {
    return {
      viewMode: true,
    };
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
    stepActionsPartVisible: {
      type: [Boolean, Number],
      default() {
        return null;
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