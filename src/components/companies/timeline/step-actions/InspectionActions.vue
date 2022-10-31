<template>
  <div class="step-action">
    <teleport to="body">
      <transition
        mode="out-in"
        enter-active-class="animate__animated animate__zoomIn for__modal"
        leave-active-class="animate__animated animate__zoomOut for__modal"
      >
        <Modal
          title="Отправка"
          v-if="sendObjectsModalVisible"
          class="autosize"
          @close="closeSendObjectsModal"
        >
          <SendObjects
            @send="sendOffers"
            :formdata="sendObjectsFormdata"
            :loader="loader"
          >
            <Objects>
              <ObjectsList
                :objects="selectedObjects"
                :selectedObjects="selectedObjects"
                :disabled="true"
                col="col-3"
                label="Выбранные предложения"
                @select="select"
                @unSelect="unSelect"
                @addComment="addComment"
              />
            </Objects>
          </SendObjects>
        </Modal>
      </transition>
    </teleport>
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
                @send="openSendObjectsModal"
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
import { MixinWithSendLetter } from "../../objects/mixins";
import {
  InspectionDoneComment,
  InspectionOffersNotFound,
} from "../comments/commenst";
import SendObjects from "../../objects/send-objects/SendObjects";

export default {
  name: "InspectionActions",
  mixins: [MixinStepActions, MixinWithSendLetter],
  components: {
    Inspection,
    SendObjects,
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
    sendObjectsFormdata() {
      return {
        contactForSendMessage: [this.defaultContactForSend],
        subject: "Список предложений от Pennylane Realty",
        wayOfSending: [0],
        message: `<p>С уважением, ${this.THIS_USER.userProfile.medium_name}</p><p>менеджер PLR</p>`,
      };
    },
    defaultContactForSend() {
      if (
        !this.currentRequest ||
        !this.currentRequest.contact ||
        !this.currentRequest.contact.emails
      )
        return null;
      return this.currentRequest.contact.emails[0].email;
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