<template>
  <div class="ymap" :key="render">
    <p class="text-info">
      РАССТОЯНИЕ: {{ route.length }}, ВРЕМЯ: {{ route.time }}
    </p>
    <yandex-map
      v-if="mounted"
      :settings="settings"
      :coords="options.coords"
      :zoom="options.zoom"
      :controls="options.controls"
      ref="map"
      style="width: 100%; height: 400px"
    >
      <!-- <ymap-marker
        v-for="object in CURRENT_STEP_OBJECTS"
        :key="object.original_id"
        :marker-id="object.original_id"
        :coords="[object.latitude, object.longitude]"
        :hint-content="object.object_type_name"
        :balloon="{
          header: object.district_name + ' - ' + object.direction_name,
          body: object.object_type_name,
          footer: object.address,
        }"
        :icon="{ color: 'green' }"
        cluster-name="1"
      ></ymap-marker> -->
    </yandex-map>
  </div>
</template>

<script>
import { yandexMap, loadYmap } from "vue-yandex-maps";
export default {
  name: "Ymap",
  components: { yandexMap },
  data() {
    return {
      render: 0,
      mounted: false,
      route: {
        done: false,
        userLocation: this.userLocation,
        length: null,
        time: null,
        warning: null,
      },
      settings: {
        apiKey: "59572809-066b-46d5-9e5d-269a65751b84",
        lang: "ru_RU",
        coordorder: "latlong",
        enterprise: false,
        version: "2.1",
      },
      options: {
        coords: [55.75554289958026, 37.619346417968764],
        zoom: 7,
        controls: ["trafficControl", "zoomControl"],
      },
    };
  },
  props: {
    manualRoute: {
      type: Array,
      default: () => [],
    },
    userLocation: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    dataForRoute() {
      const data = {
        coords: [],
      };
      data.coords.push(this.route.userLocation);

      this.manualRoute.map((object) => {
        data.coords.push([object.latitude, object.longitude]);
      });
      //   coords.push(this.route.userLocation);

      return data;
    },
  },
  async mounted() {
    await loadYmap({ ...this.settings, debug: true });
    this.mounted = true;
    this.runBuildRoute();
  },
  methods: {
    runBuildRoute() {
      this.reRender();
      if (this.mounted) {
        setTimeout(() => {
          this.buildRoute();
        }, 500);
      }
    },
    buildRoute() {
      const myMap = this.$refs.map.$options.static.myMap;
      var multiRoute = new window.ymaps.multiRouter.MultiRoute(
        {
          referencePoints: this.dataForRoute.coords,
          params: {
            avoidTrafficJams: true,
            // viaIndexes: [2],
            // routingMode: "masstransit",
          },
        },
        {
          boundsAutoApply: true,
          wayPointStartIconColor: "#FFFFFF",
          wayPointStartIconFillColor: "teal",

          wayPointFinishIconColor: "#FFFFFF",
          wayPointFinishIconFillColor: "#f93154",
        }
      );
      this.setRouteData(multiRoute);
      this.customizePoints(multiRoute);
      myMap.geoObjects.add(multiRoute);
    },
    setRouteData(multiRoute) {
      multiRoute.model.events.add("requestsuccess", () => {
        var activeRoute = multiRoute.getActiveRoute();
        this.route.done = false;
        this.route.length = activeRoute.properties.get("distance").text;
        this.route.time = activeRoute.properties.get("duration").text;
        if (activeRoute.properties.get("blocked")) {
          this.route.warning =
            "На маршруте имеются участки с перекрытыми дорогами.";
        }
      });
    },
    customizePoints(multiRoute) {
      multiRoute.model.events.once("requestsuccess", () => {
        let index = 0;
        let wayPoint = null;
        while ((wayPoint = multiRoute.getWayPoints().get(index))) {
          if (index == 0) {
            index++;
            continue;
          }
          wayPoint.options.set({
            preset: "cluster#balloonTwoColumns",
            iconContentLayout: window.ymaps.templateLayoutFactory.createClass(
              `<div style="width: 100%; height: 100%" title="${
                this.manualRoute[index - 1].object_type_name +
                "\n" +
                this.manualRoute[index - 1].address
              }">
              <span style="color: red; text-transform: uppercase;">${
                this.manualRoute[index - 1].district_name +
                "-" +
                this.manualRoute[index - 1].direction_name
              }</span></div>`
            ),
            //         balloonContentLayout: window.ymaps.templateLayoutFactory
            //           .createClass(`<div v-html="properties.balloonContentHeader"></div>
            // <div v-html="properties.balloonContentBody"></div>
            // <div v-html="properties.balloonContentFooter"></div>`),
          });
          index++;
        }
      });
    },
    reRender() {
      this.render++;
    },
  },
  watch: {
    manualRoute: {
      handler() {
        console.log("CHANGED");
        if (this.mounted) {
          this.runBuildRoute();
        }
      },
      deep: true,
    },
  },
};
</script>

<style>
</style>