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
                  title="Отправить презентации с объектами клиенту"
                  @click.prevent="sendObjects"
                  :disabled="
                    !selectedObjects.length || !contactForSendMessage.length
                  "
                  v-if="step.number == 1"
                >
                  <i class="fas fa-paper-plane"></i>
                  <span class="ml-1">Отправить</span>
                </button>
                <button
                  class="action primary"
                  @click.prevent="sendObjects(false)"
                  :disabled="!selectedObjects.length"
                  v-else
                >
                  <i class="fas fa-check"></i>
                  <span class="ml-1">Готово</span>
                </button>
              </div>
              <div class="col-2 ml-1" v-if="step.number == 3">
                <button
                  class="action success"
                  @click.prevent="sendObjects"
                  :disabled="
                    !selectedObjects.length || !contactForSendMessage.length
                  "
                >
                  <i class="fas fa-paper-plane"></i>
                  <span class="ml-1">Отправить</span>
                </button>
              </div>
              <div class="col-4">
                <CustomButton
                  class="ml-1"
                  :options="{
                    btnActive: step.negative,
                    btnClass: 'danger',
                    btnVisible: false,
                  }"
                  @confirm="selectNegative"
                >
                  <template #btnContent>
                    <i class="far fa-frown-open"></i>
                    <span class="ml-1">Нет подходящих</span>
                  </template>
                </CustomButton>
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
            <div class="col-12 px-2">
              <div class="company-table-view">
                <table>
                  <tbody>
                    <ObjectsItemTable
                      v-for="object in ALL_OBJECTS"
                      :object="object"
                      :selectedObjects="selectedObjects"
                      :key="object.id"
                      :classList="
                        CURRENT_STEP_OBJECTS.find(
                          (item) => item.id == object.id
                        )
                          ? 'success'
                          : ''
                      "
                      @selectObject="selectObject"
                      @unSelectObject="unSelectObject"
                    />
                  </tbody>
                </table>
              </div>
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
import CustomButton from "@/components/CustomButton.vue";
import { notify } from "@kyvg/vue3-notification";

export default {
  name: "Objects",
  components: {
    ObjectsItem,
    ObjectsItemTable,
    Loader,
    Pagination,
    CustomButton,
  },
  data() {
    return {
      loader: false,
      selectedObjects: [],
      viewMode: true,
    };
  },
  props: {
    step: {
      type: [Object, Boolean],
    },
    contactForSendMessage: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  computed: {
    ...mapGetters([
      "OBJECTS_PAGINATION",
      "CURRENT_STEP_OBJECTS",
      "ALL_OBJECTS",
      "TIMELINE_REQUEST_ID",
      "THIS_USER",
      "OBJECTS_CURRENT_PAGE",
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
      "RESET_CURRENT_STEP_OBJECTS",
    ]),

    selectObject(object, comment = null) {
      if (this.step.number == 7) {
        return this.selectObjectOne(object, comment);
      }
      this.selectedObjects = this.selectedObjects.filter(
        (item) => item.id != object.id
      );
      object.comment = comment;
      this.selectedObjects.push(object);
      this.$emit("updateSelectedObjectList", this.selectedObjects);
    },
    selectObjectOne(object, comment = null) {
      this.selectedObjects = [];
      object.comment = comment;
      this.selectedObjects.push(object);
      this.$emit("updateSelectedObjectList", this.selectedObjects);
    },
    unSelectObject(object) {
      this.selectedObjects = this.selectedObjects.filter(
        (item) => item.id != object.id
      );
      this.$emit("updateSelectedObjectList", this.selectedObjects);
    },
    loadMore() {
      this.INCRIMENT_OBJECTS_CURRENT_PAGE();
      this.FETCH_ALL_OBJECTS(this.step.number);
    },
    clickResetSelectObjects() {
      this.selectedObjects = [];
    },

    selectNegative(comment) {
      let data = this.step;

      if (data.negative) {
        data.negative = 0;
        data.newActionComments = [];
      } else {
        data.negative = 1;
        let actionComment = "Нет подходящих";
        let title = "система";
        if (comment) {
          actionComment += ` с комментарием: "${comment}"`;
          title = this.THIS_USER.username;
        }
        data.newActionComments = [
          {
            timeline_step_id: data.id,
            title: title,
            comment: actionComment,
          },
        ];
      }
      this.$emit("updateItem", data);
    },
    sendObjects(sendClient = true) {
      console.log(this.contactForSendMessage);
      if (sendClient) {
        if (this.contactForSendMessage.length) {
          this.sendObjectsHandler(sendClient);
        } else {
          let notifyOptions = {
            group: "app",
            type: "error",
            duration: 5000,
          };
          notifyOptions.title = "Ошибка";
          notifyOptions.text = "Выберите контакт!";
          notify(notifyOptions);
        }
      } else {
        this.sendObjectsHandler(sendClient);
      }
    },
    async sendObjectsHandler(sendClientFlag) {
      this.loader = true;
      let data = {
        ...this.step,
      };
      data.negative = 0;
      data.additional = 0;
      if (this.step.number != 2) {
        data.status = 1;
      }
      data.timelineStepObjects = [];
      this.selectedObjects.map((item) => {
        data.timelineStepObjects.push({
          timeline_step_id: data.id,
          object_id: item.original_id,
          offer_id: item.id,
          complex_id: item.complex_id,
          type_id: item.type_id,
          comment: item.comment,
        });
      });

      let comment = this.getObjectsComments(data.timelineStepObjects);

      data.newActionComments = [
        {
          timeline_step_id: data.id,
          title: "система",
          comment: comment,
        },
      ];
      if (sendClientFlag) {
        data.sendClientFlag = true;
      } else {
        data.sendClientFlag = false;
      }
      if (await this.UPDATE_STEP(data)) {
        data.timelineStepObjects = data.timelineStepObjects.concat(
          this.step.timelineStepObjects
        );
        this.$emit("updated", data);
        this.clickResetSelectObjects();
      }
    },
    getObjectsComments(objects) {
      let objectsComments = "";
      let comment = "";
      if (this.step.number == 1) {
        comment = `
        <span>
          Отправил клиенту предложения (${objects.length})
        </span>
        `;
      } else {
        comment = `Выбрал предложения  (${objects.length})`;
      }
      objects.map((object) => {
        if (!object.comment) {
          return;
        }
        objectsComments += `<li><a
              class="text-primary"
              href="https://pennylane.pro/complex/${object.complex_id}?offer_id=[${object.object_id}]"
              target="_blanc"
            >
              ${object.complex_id}~${object.object_id}
            </a> - 
            <span title="комментарий к объекту">
            ${object.comment}
           </span>
            </li>`;
      });

      if (objectsComments.length) {
        comment = `${comment} c комментариями: <ul>${objectsComments}</ul>`;
      }
      return comment;
    },
    async getCurrentStepObjects(getAllObjectsFlag = true) {
      if (!this.step) {
        return;
      }
      this.loader = true;
      await this.FETCH_CURRENT_STEP_OBJECTS(this.step.timelineStepObjects);
      if (getAllObjectsFlag) {
        await this.FETCH_ALL_OBJECTS(this.step.number);
        console.warn(this.ALL_OBJECTS);
        console.error(this.OBJECTS_CURRENT_PAGE);
      }
      this.loader = false;
    },
  },
  beforeUnmount() {
    this.RESET_CURRENT_STEP_OBJECTS();
    this.RETURN_OBJECTS_CURRENT_PAGE_TO_FIRST();
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