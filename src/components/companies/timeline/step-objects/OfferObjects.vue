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
      <div class="col-3 pr-1">
        <button
          class="btn btn-warning btn-large"
          @click.prevent="$emit('clickResetSelectObjects')"
        >
          сбросить выделение
        </button>
      </div>
      <div class="col-3 pr-1">
        <button
          class="btn btn-danger btn-large"
          @click.prevent="$emit('clickResetSelectObjects')"
        >
          нет подходящих
        </button>
      </div>
    </div>
    <div class="row no-gutters inner scroller">
      <div class="col-6">
        <slot></slot>
      </div>
      <div class="col-6 text-right companies-actions">
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
            <p>Отправленные предложения</p>
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
            <p>Все предложения</p>
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
import ObjectsItemTable from "@/components/companies/objects/ObjectsItemTable.vue";
import ObjectsItem from "@/components/companies/objects/ObjectsItem.vue";
import Pagination from "@/components/Pagination";
import Loader from "@/components/Loader";
export default {
  name: "OfferObjects",
  components: {
    ObjectsItem,
    ObjectsItemTable,
    Pagination,
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
    pagination: {
      type: Object,
    },
    stepActionsPartVisible: {
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
    "selectObject",
    "unSelectObject",
    "loadMore",
  ],
};
</script>

<style>
</style>