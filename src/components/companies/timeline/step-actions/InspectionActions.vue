<template>
  <div class="step-action">
    <div class="row no-gutters inner scroller">
      <div class="col-12">
        <div class="row pb-2 mx-0">
          <div class="col-12">
            <div class="timeline-actions row">
              <Inspection
                :step="step"
                :disabled="disabled"
                :objects="step.timelineStepObjects"
                :buttons="buttons"
                @done="done"
                @send="send"
                @negative="negative"
                @updateItem="clickUpdateStep"
              />
            </div>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-12">
            <Objects>
              <ObjectsList
                :objects="preventStepObjects"
                :currentObjects="step.timelineStepObjects"
                :selectedObjects="selectedObjects"
                :disabled="disabled"
                :withSeparator="true"
                :loader="loader"
                :viewMode="viewMode"
                :currentStepId="step.id"
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
import { MixinObject } from "../../objects/mixins";
import { InspectionDoneComment, InspectionOffersNotFound } from "../comments/commenst";

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
          defaultBtn: true,
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
          defaultBtn: true,
          disabled: !this.selectedObjects.length || this.disabled,
          title: "Отправить презентации с объектами клиенту",
          text: "Отправить клиенту",
          icon: "fas fa-paper-plane",
          withWayOfSending: true,
          emited_event: "send",
          classes: "col-2 ml-1",
        },
        {
          btnClass: "danger",
          btnVisible: false,
          defaultBtn: true,
          btnActive: this.step.negative,
          disabled: this.disabled,
          title: "Отправить презентации с объектами клиенту",
          text: "Нет подходящих",
          icon: "far fa-frown-open",
          emited_event: "negative",
          classes: "col-2 ml-1",
        },
      ];
    },
  },
  methods: {
    updatedObjects(data, fn = null) {
      this.$emit("updatedObjects", data, false, fn);
    },
    getNegativeComment(step) {
      return [new InspectionOffersNotFound(step)];
    },
    getDoneComment(step) {
      return [new InspectionDoneComment(step, this.selectedObjects)];
    },
  },
};
</script>

<style>
</style>