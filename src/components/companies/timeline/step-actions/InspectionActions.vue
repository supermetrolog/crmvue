<template>
  <div class="step-action">
    <div class="row no-gutters inner scroller">
      <div class="col-12">
        <div class="row px-2 pb-2" v-if="step.timelineStepObjects.length">
          <div class="col-12">
            <div class="timeline-actions row">
              <Inspection
                :step="step"
                :disabled="disabled"
                :objects="currentStepObjects"
                @updateItem="clickUpdateStep"
                :contactForSendMessage="contactForSendMessage"
              />
            </div>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-12">
            <Objects>
              <ObjectsControllPanel
                :viewMode="viewMode"
                :buttons="buttons"
                @reset="reset"
                @done="done"
                @send="send"
                @alreadySent="alreadySent"
                @negative="negative"
                @changeViewMode="changeViewMode"
              />
              <ObjectsList
                :objects="preventStepObjects"
                :currentObjects="step.timelineStepObjects"
                :selectedObjects="selectedObjects"
                :disabled="disabled"
                :withSeparator="true"
                :loader="loader"
                @select="select"
                @unSelect="unSelect"
                @addComment="addComment"
              />
            </Objects>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Inspection from "../steps/Inspection.vue";
import { mapGetters } from "vuex";
import { MixinStepActions } from "../mixins";
import { MixinObject } from "../../objects-new/mixins";

export default {
  name: "InspectionActions",
  mixins: [MixinStepActions, MixinObject],
  components: {
    Inspection,
  },
  computed: {
    ...mapGetters(["CURRENT_STEP_OBJECTS"]),
    currentStepObjects() {
      let array = [];
      let objectItem = null;
      this.step.timelineStepObjects.map((item) => {
        objectItem = this.preventStepObjects.find(
          (object) => object.original_id == item.object_id
        );
        if (objectItem) {
          array.push(objectItem);
        }
      });
      return array;
    },
    buttons() {
      return [
        {
          btnClass: "primary",
          btnVisible: false,
          disabled: !this.selectedObjects.length || this.disabled,
          title: "Сохранить",
          text: "Готово",
          icon: "fas fa-check",
          emited_event: "done",
          classes: "col-2",
        },
        {
          btnClass: "success",
          btnVisible: false,
          disabled: !this.selectedObjects.length || this.disabled,
          title: "Отправить презентации с объектами клиенту",
          text: "Отправить",
          icon: "fas fa-paper-plane",
          emited_event: "send",
          classes: "col-2 ml-1",
        },
        {
          btnClass: "primary",
          btnVisible: false,
          disabled: !this.selectedObjects.length || this.disabled,
          title: "Уже отправил предложения другим способом",
          text: "Уже отправил",
          icon: "fas fa-paper-plane",
          emited_event: "alreadySent",
          classes: "col-3 ml-1",
        },
        {
          btnClass: "danger",
          btnVisible: false,
          btnActive: this.step.negative,
          disabled: this.disabled,
          title: "Отправить презентации с объектами клиенту",
          text: "Нет подходящих",
          icon: "far fa-frown-open",
          emited_event: "negative",
          classes: "col-4 ml-1",
        },
      ];
    },
  },
  methods: {
    updatedObjects(data, fn = null) {
      this.$emit("updatedObjects", data, false, fn);
    },
  },
};
</script>

<style>
</style>