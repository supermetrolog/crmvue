<template>
  <div class="objects">
    <div class="row no-gutters">
      <div class="col-12 objects-actions py-2">
        <div class="row no-gutters">
          <div class="col-8 px-2">
            <div class="timeline-actions row no-gutters">
              <div class="col-2">
                <button
                  class="action success"
                  @click.prevent="sendObjects"
                  :disabled="!selectedObjects.length"
                  v-if="step.number == 1"
                >
                  <i class="fas fa-paper-plane"></i>
                  <span class="ml-1">Отправить</span>
                </button>
                <button
                  class="action success"
                  @click.prevent="sendObjects"
                  :disabled="!selectedObjects.length"
                  v-else
                >
                  <i class="fas fa-check"></i>
                  <span class="ml-1">Готово</span>
                </button>
              </div>
              <div class="col-4">
                <button
                  class="ml-1 action danger"
                  :class="{ active: step.negative }"
                  @click="clickNegative"
                >
                  <i class="far fa-frown-open"></i>
                  <span class="ml-1">Нет подходящих</span>
                </button>
              </div>
            </div>
          </div>
          <div class="col-4 text-right companies-actions px-2">
            <div class="row no-gutters">
              <div class="col-4 align-self-center">
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
              <div class="col-8 pl-1">
                <div class="timeline-actions row no-gutters">
                  <div class="col-12">
                    <button
                      class="action warning"
                      @click.prevent="clickResetSelectObjects"
                      title="Сбросить выделения предложений"
                    >
                      <i class="fas fa-redo"></i>
                      <span class="ml-1">Сбросить</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12">
        <Loader class="center" v-if="loader" />
        <div
          class="row no-gutters"
          v-if="CURRENT_STEP_OBJECTS.length && step.number == 1"
        >
          <div class="col-12 px-2 pb-1">
            <h5 class="m-0">Отправленные предложения</h5>
          </div>
          <template v-if="viewMode">
            <ObjectsItem
              v-for="object in CURRENT_STEP_OBJECTS"
              :object="object"
              :selectedObjects="selectedObjects"
              :key="object.id"
              :classList="'success'"
              @selectObject="selectObject"
              @unSelectObject="unSelectObject"
            />
          </template>
          <template v-else>
            <div class="company-table-view px-2">
              <table>
                <tbody>
                  <ObjectsItemTable
                    v-for="object in CURRENT_STEP_OBJECTS"
                    :object="object"
                    :selectedObjects="selectedObjects"
                    :key="object.id"
                    :classList="'success'"
                    @selectObject="selectObject"
                    @unSelectObject="unSelectObject"
                  />
                </tbody>
              </table>
            </div>
          </template>
          <hr />
          <div class="col-12 px-2 pb-1">
            <h5 class="m-0">Все предложения</h5>
          </div>
        </div>
        <div class="row no-gutters" v-if="ALL_OBJECTS.length">
          <template v-if="viewMode">
            <ObjectsItem
              v-for="object in ALL_OBJECTS"
              :object="object"
              :selectedObjects="selectedObjects"
              :key="object.id"
              :classList="
                CURRENT_STEP_OBJECTS.find((item) => item.id == object.id)
                  ? 'success'
                  : ''
              "
              @selectObject="selectObject"
              @unSelectObject="unSelectObject"
            />
          </template>
          <template v-else>
            <div class="company-table-view px-2">
              <table>
                <tbody>
                  <ObjectsItemTable
                    v-for="object in ALL_OBJECTS"
                    :object="object"
                    :selectedObjects="selectedObjects"
                    :key="object.id"
                    :classList="
                      CURRENT_STEP_OBJECTS.find((item) => item.id == object.id)
                        ? 'success'
                        : ''
                    "
                    @selectObject="selectObject"
                    @unSelectObject="unSelectObject"
                  />
                </tbody>
              </table>
            </div>
          </template>
        </div>
      </div>
      <div class="col-12 text-center" v-if="step.number == 1">
        <Pagination :pagination="OBJECTS_PAGINATION" @loadMore="loadMore" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ObjectsItem from "@/components/companies/objects/ObjectsItem.vue";
import ObjectsItemTable from "@/components/companies/objects/ObjectsItemTable.vue";
import Pagination from "@/components/Pagination";
import Loader from "@/components/Loader";

export default {
  name: "Objects",
  components: {
    ObjectsItem,
    ObjectsItemTable,
    Loader,
    Pagination,
  },
  data() {
    return {
      loader: false,
      selectedObjects: [],
      viewMode: false,
    };
  },
  props: {
    step: {
      type: [Object, Boolean],
    },
  },
  computed: {
    ...mapGetters([
      "OBJECTS_PAGINATION",
      "CURRENT_STEP_OBJECTS",
      "ALL_OBJECTS",
      "TIMELINE_REQUEST_ID",
    ]),
  },
  methods: {
    ...mapActions([
      "FETCH_ALL_OBJECTS",
      "INCRIMENT_OBJECTS_CURRENT_PAGE",
      "RETURN_OBJECTS_CURRENT_PAGE_TO_FIRST",
      "FETCH_CURRENT_STEP_OBJECTS",
      "SEND_OBJECTS",
      "UPDATE_STEP",
      "FETCH_COMPANY_REQUESTS",
    ]),

    selectObject(object) {
      this.selectedObjects.push(object);
    },
    selectObjectOne(object) {
      this.selectedObjects = [];
      this.selectedObjects.push(object);
    },
    unSelectObject(object) {
      this.selectedObjects = this.selectedObjects.filter(
        (item) => item.id != object.id
      );
    },
    // async submitDeal(requestDealData) {
    //   this.loader = true;
    //   let data = {
    //     ...this.step,
    //   };
    //   data.requestDealData = requestDealData;
    //   data.negative = 0;
    //   data.done = 1;
    //   data.timelineStepObjects = [];
    //   this.selectedObjects.map((item) => {
    //     data.timelineStepObjects.push({
    //       timeline_step_id: data.id,
    //       object_id: item.original_id,
    //       offer_id: item.id,
    //       complex_id: item.complex_id,
    //       type_id: item.type_id,
    //     });
    //   });
    //   data.requestDealData.complex_id = data.timelineStepObjects[0].complex_id;
    //   data.requestDealData.object_id = data.timelineStepObjects[0].object_id;

    //   if (await this.UPDATE_STEP(data)) {
    //     data.timelineStepObjects = data.timelineStepObjects.concat(
    //       this.step.timelineStepObjects
    //     );
    //     this.$emit("updated", data);
    //     this.clickResetSelectObjects();
    //     await this.FETCH_COMPANY_REQUESTS(this.$route.params.id);
    //   }
    //   this.loader = false;
    // },
    loadMore() {
      this.INCRIMENT_OBJECTS_CURRENT_PAGE();
      this.FETCH_ALL_OBJECTS(this.step.number);
    },
    clickResetSelectObjects() {
      this.selectedObjects = [];
    },

    clickNegative() {
      let data = this.step;
      if (data.negative) {
        data.negative = 0;
        data.newActionComments = [];
      } else {
        data.negative = 1;
        data.newActionComments = [
          {
            timeline_step_id: data.id,
            title: "система",
            comment: "Нет подходящих",
          },
        ];
      }
      this.$emit("updateItem", data);
    },
    async sendObjects() {
      this.loader = true;
      let data = {
        ...this.step,
      };
      data.negative = 0;
      data.additional = 0;
      data.timelineStepObjects = [];
      this.selectedObjects.map((item) => {
        data.timelineStepObjects.push({
          timeline_step_id: data.id,
          object_id: item.original_id,
          offer_id: item.id,
          complex_id: item.complex_id,
          type_id: item.type_id,
        });
      });
      let comment =
        data.number == 1
          ? `Отправил клиенту предложения (${data.timelineStepObjects.length})`
          : `Выбрал предложения (${data.timelineStepObjects.length})`;
      data.newActionComments = [
        {
          timeline_step_id: data.id,
          title: "система",
          comment: comment,
        },
      ];
      if (await this.UPDATE_STEP(data)) {
        data.timelineStepObjects = data.timelineStepObjects.concat(
          this.step.timelineStepObjects
        );
        this.$emit("updated", data);
        this.clickResetSelectObjects();
      }
    },
    async getCurrentStepObjects(getAllObjectsFlag = true) {
      if (!this.step) {
        return;
      }
      this.loader = true;
      await this.FETCH_CURRENT_STEP_OBJECTS(this.step.timelineStepObjects);
      if (getAllObjectsFlag) {
        await this.FETCH_ALL_OBJECTS(this.step.number);
      }
      this.loader = false;
    },
  },
  watch: {
    step(before, after) {
      if (before.id != after.id) {
        this.getCurrentStepObjects();
        this.clickResetSelectObjects();
        this.RETURN_OBJECTS_CURRENT_PAGE_TO_FIRST();
      } else {
        if (this.loader) {
          this.getCurrentStepObjects(false);
        }
      }
    },
  },
  async created() {
    this.getCurrentStepObjects();
  },
};
</script>

<style>
</style>