<template>
  <div class="col inspection" v-if="data">
    <div class="row" v-if="userLocation">
      <div class="col-5">
        <div class="row no-gutters">
          <div class="col-12">
            <h3 class="text-center">Маршрут</h3>

            <CustomButton
              :options="{
                btnClass: 'success',
                btnVisible: false,
                defaultBtn: true,
              }"
              @confirm="selectOptimizeRoute"
            >
              <template #btnContent>
                <i class="fas fa-check"></i>
                оптимизировать
              </template>
            </CustomButton>
            <!-- <a :href="yandexMapRoutesUrl" target="_blank"
              >посмотреть на карте<i class="fas fa-route ml-1"></i
            ></a> -->
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
                      :key="object.id"
                      class="route"
                    >
                      <div class="row">
                        <div class="col-4 align-self-center pr-0 pl-2">
                          <img
                            :src="
                              object.building.photos
                                ? object.building.photos
                                : object.photos[0]
                            "
                            alt="Фото объекта"
                          />
                        </div>
                        <div class="col-8 pl-2">
                          <b>
                            {{ object.district_name }} -
                            {{ object.direction_name }}
                          </b>
                          <p>{{ object.object_type_name }}</p>
                          <p>{{ object.address }}</p>
                        </div>
                      </div>
                    </li>
                  </transition-group>
                </draggable>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="col-7 align-self-center">
        <Ymap :manualRoute="currentStepObjects" :userLocation="userLocation" />
      </div>
    </div>
    <div v-else>
      <h3 class="text-danger">
        Разрешите передачу вашего местоположения и перезагрузите страницу!
      </h3>
    </div>
  </div>
</template>

<script>
import { yandexmap } from "@/utils";
import { mapGetters } from "vuex";
import CustomButton from "@/components/CustomButton.vue";
import { VueDraggableNext } from "vue-draggable-next";
import Ymap from "@/components/Ymap.vue";
export default {
  name: "Inspection",
  components: {
    Ymap,
    draggable: VueDraggableNext,
    CustomButton,
  },
  data() {
    return {
      data: this.step,
      currentStepObjects: [],
      userLocation: false,
    };
  },
  props: {
    step: {
      type: Object,
    },
    disabled: {
      type: Boolean,
    },
  },
  computed: {
    ...mapGetters(["CURRENT_STEP_OBJECTS"]),
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
      if (this.currentStepObjects.length) {
        yandexmap.getOptimizeRoutes(coords);
      }
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
    selectOptimizeRoute() {
      this.currentStepObjects = [...this.CURRENT_STEP_OBJECTS];
      console.log("optimize");
    },
  },
  mounted() {
    this.currentStepObjects = [...this.CURRENT_STEP_OBJECTS];
    this.getLocation();
  },
  watch: {
    step() {
      this.data = this.step;
    },
    CURRENT_STEP_OBJECTS() {
      this.currentStepObjects = [...this.CURRENT_STEP_OBJECTS];
    },
  },
  emits: ["updateItem"],
};
</script>

<style>
.red {
  color: red;
}
</style>