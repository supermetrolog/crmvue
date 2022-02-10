<template>
  <div class="objects">
    <div class="row no-gutters">
      <div class="col-12 objects-actions py-2">
        <div class="row no-gutters">
          <div class="col-8 px-2">
            <div class="timeline-actions row no-gutters">
              <div class="col-2">
                <CustomButton
                  title="Отправить презентации с объектами клиенту"
                  :options="{
                    btnClass: 'success',
                    btnVisible: false,
                    disabled: !selectedObjects.length,
                  }"
                  @confirm="sendObjects"
                  @extraVisibleOpen="extraVisibleOpen = true"
                  @extraVisibleClose="extraVisibleOpen = false"
                  v-if="step.number == 1"
                >
                  <template #btnContent>
                    <i class="fas fa-paper-plane"></i>
                    <span class="ml-1">Отправить</span>
                  </template>
                </CustomButton>
                <CustomButton
                  title="Отправить презентации с объектами клиенту"
                  :options="{
                    btnClass: 'primary',
                    btnVisible: false,
                    disabled: !selectedObjects.length,
                  }"
                  @extraVisibleOpen="extraVisibleOpen = true"
                  @extraVisibleClose="extraVisibleOpen = false"
                  @confirm="sendObjects($event, false)"
                  v-else
                >
                  <template #btnContent>
                    <i class="fas fa-check"></i>
                    <span class="ml-1">Готово</span>
                  </template>
                </CustomButton>
              </div>
              <div class="col-2 ml-1" v-if="step.number == 3">
                <CustomButton
                  :options="{
                    btnClass: 'success',
                    btnVisible: false,
                    disabled: !selectedObjects.length,
                  }"
                  @extraVisibleOpen="extraVisibleOpen = true"
                  @extraVisibleClose="extraVisibleOpen = false"
                  @confirm="sendObjects"
                >
                  <template #btnContent>
                    <i class="fas fa-paper-plane"></i>
                    <span class="ml-1">Отправить</span>
                  </template>
                </CustomButton>
              </div>
              <div class="col-4">
                <CustomButton
                  class="ml-1"
                  :options="{
                    btnActive: step.negative,
                    btnClass: 'danger',
                    btnVisible: false,
                    disabled,
                  }"
                  @confirm="selectNegative"
                  @extraVisibleOpen="extraVisibleOpen = true"
                  @extraVisibleClose="extraVisibleOpen = false"
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
      <div
        class="col-12 objects-list-container"
        v-if="currentStepObjects.length && step.number == 1"
      >
        <Loader class="center" v-if="loader" />
        <div class="row no-gutters">
          <div class="col-12 px-2 pb-1">
            <h5 class="m-0">Отправленные предложения</h5>
          </div>
          <template v-if="viewMode">
            <ObjectsItem
              v-for="object in currentStepObjects"
              :disabled="disabled"
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
                    v-for="object in currentStepObjects"
                    :disabled="disabled"
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
      </div>
      <div
        class="col-12 px-0 py-2 mb-1 objects-search"
        :class="{ 'action-open': extraVisibleOpen }"
        v-if="searchable && !loader"
      >
        <ObjectsSearch v-if="searchable" @search="search" />
      </div>
      <div class="col-12 objects-list-container">
        <Loader class="center" v-if="loader" />
        <div
          class="row no-gutters all-objects-container"
          v-if="allObjects.length"
        >
          <Loader class="center" v-if="allObjectsLoader" />

          <template v-if="viewMode">
            <ObjectsItem
              v-for="object in allObjects"
              :disabled="disabled"
              :object="object"
              :selectedObjects="selectedObjects"
              :key="object.id"
              :objectComment="comment(object.original_id)"
              :classList="
                currentStepObjects.find((item) => item.id == object.id)
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
                      v-for="object in allObjects"
                      :disabled="disabled"
                      :object="object"
                      :selectedObjects="selectedObjects"
                      :key="object.id"
                      :classList="
                        currentStepObjects.find((item) => item.id == object.id)
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

        <div v-if="!allObjects.length && searchable && searchMode">
          <h2 class="text-warning text-center">НЕТ ДАННЫХ</h2>
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
import ObjectsSearch from "@/components/companies/objects/ObjectsSearch.vue";
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
    ObjectsSearch,
  },
  data() {
    return {
      loader: false,
      allObjectsLoader: false,
      selectedObjects: [],
      searchParams: null,
      searchMode: false,
      viewMode: true,
      count: 0,
      allObjects: [],
      currentStepObjects: [],
      extraVisibleOpen: false,
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
    disabled: {
      type: Boolean,
      default: true,
    },
    searchable: {
      type: Boolean,
      default: false,
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
      "SEARCH_OBJECTS",
    ]),
    comment(original_id) {
      const result = this.currentStepObjects.find(
        (item) => item.original_id == original_id
      );
      if (result && result.comment) {
        return result.comment;
      }
      return null;
    },
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
      if (this.searchMode) {
        this.searchObjects(this.searchParams);
      } else {
        this.getAllObjects();
      }
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
          title = this.THIS_USER.userProfile.short_name;
        }
        data.newActionComments = [
          {
            timeline_id: data.timeline_id,
            timeline_step_id: data.id,
            timeline_step_number: data.number,
            title: title,
            comment: actionComment,
            type: 0,
          },
        ];
      }
      this.$emit("updateItem", data);
    },
    sendObjects(comment, sendClient = true) {
      console.error(comment, sendClient);
      if (sendClient) {
        if (this.contactForSendMessage.length) {
          this.sendObjectsHandler(comment, sendClient);
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
        this.sendObjectsHandler(comment, sendClient);
      }
    },
    async sendObjectsHandler(generalComment, sendClientFlag = false) {
      this.loader = true;
      let data = {
        ...this.step,
      };
      data.negative = 0;
      data.additional = 0;
      let title = "система";
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
        if (item.comment) {
          title = this.THIS_USER.username;
        }
      });

      let comment = this.getObjectsComments(
        generalComment,
        data.timelineStepObjects
      );
      if (generalComment) {
        title = this.THIS_USER.userProfile.short_name;
      }
      data.newActionComments = [
        {
          timeline_id: data.timeline_id,
          timeline_step_id: data.id,
          timeline_step_number: data.number,
          title: title,
          comment: comment,
          type: 0,
        },
      ];

      data.sendClientFlag = sendClientFlag;

      if (await this.UPDATE_STEP(data)) {
        data.timelineStepObjects = data.timelineStepObjects.concat(
          this.step.timelineStepObjects
        );
        this.$emit("updated", data, () => this.getObjects());
        this.clickResetSelectObjects();
      }
    },
    getObjectsComments(generalComment, objects) {
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
      if (generalComment) {
        comment += `<br>с комментарием себе: ${generalComment}`;
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
        comment = `${comment}<br>c комментариями к объектам: <ul>${objectsComments}</ul>`;
      }
      return comment;
    },
    async getCurrentStepObjects() {
      this.currentStepObjects = await this.FETCH_CURRENT_STEP_OBJECTS(
        this.step.timelineStepObjects
      );
    },
    async getAllObjects() {
      let data = await this.FETCH_ALL_OBJECTS(this.step.number);
      if (this.step.number == 1) {
        if (
          Array.isArray(this.allObjects) &&
          Array.isArray(data.offers) &&
          this.OBJECTS_CURRENT_PAGE > 1
        ) {
          this.allObjects = this.allObjects.concat(data.offers);
        } else {
          this.allObjects = data.offers;
        }
      } else {
        this.allObjects = data;
      }
    },
    async getObjects(getAllObjectsFlag = true) {
      this.count++;
      if (!this.step) {
        return;
      }
      this.loader = true;
      await this.getCurrentStepObjects(this.step.timelineStepObjects);
      console.warn("CURRENT", this.currentStepObjects);
      if (getAllObjectsFlag) {
        await this.getAllObjects(this.step.number);
        console.warn("ALL", this.allObjects);
      }
      this.loader = false;
    },
    async search(params) {
      this.searchParams = params;
      this.searchMode = true;
      this.RETURN_OBJECTS_CURRENT_PAGE_TO_FIRST();
      this.searchObjects(params);
    },
    async searchObjects(params) {
      this.allObjectsLoader = true;
      if (params.query.searchText == "") {
        this.searchMode = false;
        this.RETURN_OBJECTS_CURRENT_PAGE_TO_FIRST();
        await this.getAllObjects(this.step.number);
      } else {
        let data = await this.SEARCH_OBJECTS({ ...params });
        if (
          Array.isArray(this.allObjects) &&
          Array.isArray(data) &&
          this.OBJECTS_CURRENT_PAGE > 1
        ) {
          this.allObjects = this.allObjects.concat(data);
        } else {
          this.allObjects = data;
        }
      }
      this.allObjectsLoader = false;
    },
    clearObjects() {
      this.currentStepObjects = [];
      this.allObjects = [];
    },
  },
  beforeUnmount() {
    this.clearObjects();
    this.RESET_CURRENT_STEP_OBJECTS();
    this.RETURN_OBJECTS_CURRENT_PAGE_TO_FIRST();
  },
  async created() {
    await this.getObjects();
  },
};
</script>

<style>
.all-objects-container {
  position: relative;
}
</style>