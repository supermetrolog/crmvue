<template>
  <div class="objects-controll-panel row px-2 py-2">
    <div class="col-12">
      <div class="timeline-actions row no-gutters">
        <div
          v-for="(button, index) in buttons"
          :key="index"
          :class="button.classes"
        >
          <CustomButton
            :title="button.title"
            :options="button"
            @extraVisibleOpen="$emit('openExtraVisible')"
            @extraVisibleClose="$emit('closeExtraVisible')"
            @confirm="
              $emit(button.emited_event, { comment: $event, wayOfSending })
            "
          >
            <template #btnContent>
              <i :class="button.icon"></i>
              <span class="ml-1">{{ button.text }}</span>
            </template>
            <template #extraContent="{ data }">
              <CheckboxIcons
                v-if="button.withWayOfSending && data.openned"
                v-model="wayOfSending"
                label="Способ связи"
                :options="wayOfSendingOptions"
                :disabled="!data.openned"
              />
            </template>
          </CustomButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomButton from "@/components/common/CustomButton.vue";
import { WayOfSending } from "@/const/Const.js";
import CheckboxIcons from "@/components/common/form/CheckboxIcons.vue";
export default {
  name: "ObjectsControllPanel",
  emits: [
    "reset",
    "send",
    "alreadySent",
    "done",
    "negative",
    "changeViewMode",
    "openExtraVisible",
    "closeExtraVisible",
    "favorites",
  ],
  components: {
    CustomButton,
    CheckboxIcons,
  },
  props: {
    buttons: {
      type: Array,
      default: () => [
        {
          btnClass: "primary",
          btnVisible: false,
          disabled: true,
          title: "Отправить презентации с объектами клиенту",
          text: "Готово",
          icon: "fas fa-check",
          emited_event: "done",
          classes: "col-2",
        },
        {
          btnClass: "success",
          btnVisible: false,
          disabled: true,
          title: "Отправить презентации с объектами клиенту",
          text: "Отправить",
          icon: "fas fa-paper-plane",
          emited_event: "send",
          classes: "col-2 ml-1",
        },
        {
          btnClass: "danger",
          btnVisible: false,
          disabled: false,
          title: "Отправить презентации с объектами клиенту",
          text: "Нет подходящих",
          icon: "far fa-frown-open",
          emited_event: "negative",
          classes: "col-4 ml-1",
        },
      ],
    },
    viewMode: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      wayOfSendingOptions: WayOfSending.get("param"),
      wayOfSending: [],
    };
  },
};
</script>

<style>
</style>