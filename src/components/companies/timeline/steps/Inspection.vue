<template>
  <div class="col inspection" v-if="data">
    <StepStage
      class="mb-2 px-2"
      :title="
        'Шаг 1. Отметить объекты, которые заинтересовали клиента' +
        (data.timelineStepObjects.length
          ? ` (${data.timelineStepObjects.length})`
          : '')
      "
      :isDone="!!data.timelineStepObjects.length"
      :isCurrent="!data.timelineStepObjects.length"
      :id="1"
      :isClicked="clickedStage === 1"
      @stageClicked="stageClicked"
    >
      <ButtonList
        :buttons="buttons"
        @done="$emit('done')"
        @send="$emit('send')"
        @negative="$emit('negative')"
      />
    </StepStage>
    <StepStage
      class="mb-2 px-2"
      title="Шаг 2. Отправить всю необходимую информацию по объектам клиенту"
      :isDone="!!data.additional"
      :isCurrent="!!data.timelineStepObjects.length"
      :id="2"
      :isClicked="clickedStage === 2"
      @stageClicked="stageClicked"
    >
      <div class="row no-gutters">
        <div class="col-6 pr-1">
          <CustomButton
            title="Отправить маршрут клиенту"
            :options="{
              btnClass: 'success',
              btnVisible: false,
              defaultBtn: true,
              disabled: true,
            }"
            @confirm="selectOptimizeRoute"
          >
            <template #btnContent>
              <i class="fas fa-paper-plane"></i>

              отправить клиенту
            </template>
          </CustomButton>
        </div>
        <div class="col-6">
          <CustomButton
            title="Отправить маршрут себе"
            :options="{
              btnClass: 'success_alt',
              btnVisible: false,
              defaultBtn: true,
              disabled: true,
            }"
            @confirm="selectOptimizeRoute"
          >
            <template #btnContent>
              <i class="fas fa-paper-plane"></i>

              отправить себе
            </template>
          </CustomButton>
        </div>
      </div>
    </StepStage>
    <div
      class="row"
      v-if="
        data.timelineStepObjects.length && userLocation && clickedStage !== 1
      "
    >
      <div class="col-5">
        <div class="row no-gutters">
          <div class="col-12">
            <h3 class="text-center">Маршрут</h3>
            <CustomButton
              :options="{
                btnClass: 'primary',
                btnVisible: false,
                defaultBtn: true,
                disabled: true,
              }"
              @confirm="selectOptimizeRoute"
            >
              <template #btnContent>
                <i class="fas fa-route"></i>
                оптимизировать
              </template>
            </CustomButton>
          </div>
          <div class="col-12">
            <div class="car-routes">
              <ul class="routes mt-1">
                <li>
                  <b> Мое местоположение </b>
                </li>
                <draggable
                  class="dragArea list-group w-full"
                  :list="currentStepObjects"
                >
                  <transition-group>
                    <li
                      v-for="object in currentStepObjects"
                      :key="object.offer.id"
                      class="route"
                    >
                      <div class="row">
                        <div class="col-4 align-self-center pr-0 pl-2">
                          <img
                            :src="getImageSrc(object.offer)"
                            alt="Фото объекта"
                          />
                        </div>
                        <div class="col-8 pl-2">
                          <b>
                            {{ object.offer.visual_id }}
                          </b>
                          <p>{{ object.offer.object_type_name }}</p>
                          <p>{{ object.offer.address }}</p>
                        </div>
                      </div>
                    </li>
                  </transition-group>
                </draggable>
              </ul>
            </div>
          </div>
          <div class="col-12 mt-3"></div>
        </div>
      </div>
      <div class="col-7 align-self-center">
        <Ymap
          :manualRoute="currentStepObjects"
          :userLocation="userLocation"
          v-if="currentStepObjects.length"
        />
      </div>
    </div>
    <div
      v-if="
        !userLocation && data.timelineStepObjects.length && clickedStage !== 1
      "
    >
      <h3 class="text-danger">
        Разрешите передачу вашего местоположения и перезагрузите страницу!
      </h3>
    </div>
  </div>
</template>

<script>
import { yandexmap } from "@/utils";
import CustomButton from "@/components/common/CustomButton.vue";
import { VueDraggableNext } from "vue-draggable-next";
import Ymap from "@/components/common/Ymap.vue";
import { MixinSteps } from "../mixins";
export default {
  name: "Inspection",
  emits: ["done", "negative", "send"],
  mixins: [MixinSteps],
  components: {
    Ymap,
    draggable: VueDraggableNext,
    CustomButton,
  },
  data() {
    return {
      currentStepObjects: [],
      userLocation: false,
      clickedStage: null,
    };
  },
  props: {
    objects: {
      type: Array,
    },
  },
  computed: {
    yandexMapRoutesUrl() {
      let url = "https://yandex.ru/maps/?rtext=~";
      if (this.userLocation) {
        url =
          "https://yandex.ru/maps/?rtext=" +
          this.userLocation[0] +
          "," +
          this.userLocation[1] +
          "~";
      }
      let lastPartUrl = "&rtt=auto";

      let coords = [];
      this.currentStepObjects.map((object, index) => {
        url += object.latitude + "," + object.longitude;
        if (index != this.currentStepObjects.length - 1) {
          url += "~";
        }
        coords.push({
          original_id: object.original_id,
          coord: [+object.latitude, +object.longitude],
        });
      });
      url += lastPartUrl;
      return url;
    },
  },
  methods: {
    getLocation() {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };
      window.navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.userLocation = [pos.coords.latitude, pos.coords.longitude];
        },
        (err) => {
          console.warn(`ERROR(${err.code}): ${err.message}`);
        },
        options
      );
    },
    clickNegative() {
      this.data.negative = 1;
      this.$emit("updateItem", this.data);
    },
    async selectOptimizeRoute() {
      const result = await yandexmap.getOptimizeRoutes(
        this.currentStepObjects,
        this.userLocation
      );
      console.error("optimize", result);
    },
    getImageSrc(offer) {
      const photos = offer.photos;
      const object_photos = offer.object.photo;
      let resultImage = null;
      if (photos && Array.isArray(photos)) {
        photos.forEach((img) => {
          if (resultImage == null && typeof img == "string" && img.length > 2) {
            resultImage = "https://pennylane.pro" + img;
          }
        });
      }

      if (resultImage) {
        return resultImage;
      }
      if (
        object_photos &&
        Array.isArray(object_photos) &&
        typeof object_photos[0] == "string" &&
        object_photos[0].length > 2
      ) {
        return "https://pennylane.pro" + object_photos[0];
      }
      return this.$apiUrlHelper.fileNotFoundUrl();
    },
    stageClicked(id) {
      this.clickedStage = id;
      console.log(id, "12312313");
    },
  },
  mounted() {
    this.currentStepObjects = [...this.objects];
    this.getLocation();
  },
  watch: {
    objects() {
      this.currentStepObjects = [...this.objects];
    },
  },
};
</script>

<style>
.red {
  color: red;
}
</style>