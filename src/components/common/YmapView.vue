<template>
  <div class="ymap" :key="render">
    <yandex-map
      v-if="mounted"
      :settings="settings"
      :coords="options.coords"
      :zoom="options.zoom"
      :controls="options.controls"
      :behaviors="options.behaviors"
      :cluster-options="options.clusterOptions"
      ref="map"
      style="width: 100%; height: 400px"
    >
      <ymap-marker
        v-for="offer in list"
        :key="offer.original_id"
        :marker-id="offer.original_id"
        :coords="[offer.latitude, offer.longitude]"
        :hint-content="offer.object_type_name"
        :use-html-in-layout="true"
        :balloon="{
          header: offer.visual_id,
          body: offer.address,
          footer: getFooter(offer),
        }"
        :icon="{ color: offer.status != 1 ? 'yellow' : 'green' }"
        :cluster-name="1"
      >
      </ymap-marker>
    </yandex-map>
  </div>
</template>

<script>
import { yandexMap, loadYmap, ymapMarker } from "vue-yandex-maps";
export default {
  name: "YmapView",
  components: { yandexMap, ymapMarker },
  data() {
    return {
      render: 0,
      mounted: false,
      route: {
        done: false,
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
        zoom: 10,
        controls: ["trafficControl", "zoomControl"],
        behaviors: ["drag"],
        clusterOptions: {
          1: {
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: true,
            layout:
              "<h3 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h3>" +
              "<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>" +
              "<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>",
          },
        },
      },
    };
  },
  props: {
    manualRoute: {
      type: Array,
      default: () => [],
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    // dataForRoute() {
    //   const data = {
    //     coords: [],
    //   };
    //   this.manualRoute.map((object) => {
    //     data.coords.push([object.offer.latitude, object.offer.longitude]);
    //   });
    //   return data;
    // },
  },
  async mounted() {
    await loadYmap({ ...this.settings, debug: true });
    this.mounted = true;
    this.reRender();
    // this.runBuildRoute();
  },
  methods: {
    getFooter(offer) {
      let template = `<a href="${this.getOfferUrl(
        offer
      )}" target="_blank" class="photo">
              <div class="image-container">
                <img src="${this.imageSrc(offer)}" alt="image" />
                <span class="deal_type ${this.getClass(offer)}">
                  ${offer.deal_type_name ?? ""}
                </span>
                <span class="object_class">
                  ${offer.class_name}
                </span>
              </div>
            </a>`;
      return template;
    },
    getClass(offer) {
      if (offer.status != 1) {
        return "passive";
      }
      return "";
    },
    getOfferUrl(offer) {
      const baseUrl = "https://pennylane.pro/complex/";
      let url = baseUrl + offer.complex_id;
      if (offer.generalOffersMix) {
        url += "?offer_id=[" + offer.generalOffersMix.original_id + "]";
      } else {
        url += "?offer_id=[" + offer.original_id + "]";
      }
      return url;
    },
    imageSrc(offer) {
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
    // runBuildRoute() {
    //   this.reRender();
    //   if (this.mounted) {
    //     setTimeout(() => {
    //       this.buildRoute();
    //     }, 500);
    //   }
    // },
    // clearMyMap(map) {
    //   if (map.geoObjects) {
    //     map.geoObjects.each((object) => {
    //       map.geoObjects.remove(object);
    //     });
    //   }
    // },
    // buildRoute() {
    //   const myMap = this.$refs.map.$options.static.myMap;
    //   this.clearMyMap(myMap);
    //   var multiRoute = new window.ymaps.multiRouter.MultiRoute(
    //     {
    //       referencePoints: this.dataForRoute.coords,
    //       params: {
    //         avoidTrafficJams: true,
    //         // viaIndexes: [2],
    //         // routingMode: "masstransit",
    //       },
    //     },
    //     {
    //       boundsAutoApply: true,
    //       wayPointStartIconColor: "#FFFFFF",
    //       wayPointStartIconFillColor: "teal",

    //       wayPointFinishIconColor: "#FFFFFF",
    //       wayPointFinishIconFillColor: "#f93154",
    //     }
    //   );
    //   this.setRouteData(multiRoute);
    //   this.customizePoints(multiRoute);
    //   myMap.geoObjects.add(multiRoute);
    // },
    // setRouteData(multiRoute) {
    //   multiRoute.model.events.add("requestsuccess", () => {
    //     var activeRoute = multiRoute.getActiveRoute();
    //     this.route.done = false;
    //     this.route.length = activeRoute.properties.get("distance").text;
    //     this.route.time = activeRoute.properties.get("duration").text;
    //     if (activeRoute.properties.get("blocked")) {
    //       this.route.warning =
    //         "На маршруте имеются участки с перекрытыми дорогами.";
    //     }
    //   });
    // },
    // customizePoints(multiRoute) {
    //   multiRoute.model.events.once("requestsuccess", () => {
    //     let index = 0;
    //     let wayPoint = null;
    //     while ((wayPoint = multiRoute.getWayPoints().get(index))) {
    //       if (index == 0) {
    //         index++;
    //         continue;
    //       }
    //       wayPoint.options.set({
    //         preset: "cluster#balloonTwoColumns",
    //         iconContentLayout: window.ymaps.templateLayoutFactory.createClass(
    //           `<div style="width: 100%; height: 100%" title="${
    //             this.manualRoute[index - 1].offer.object_type_name +
    //             "\n" +
    //             this.manualRoute[index - 1].offer.address
    //           }">
    //           <span style="color: red; text-transform: uppercase;">${
    //             this.manualRoute[index - 1].offer.visual_id
    //           }</span></div>`
    //         ),
    //         //         balloonContentLayout: window.ymaps.templateLayoutFactory
    //         //           .createClass(`<div v-html="properties.balloonContentHeader"></div>
    //         // <div v-html="properties.balloonContentBody"></div>
    //         // <div v-html="properties.balloonContentFooter"></div>`),
    //       });
    //       index++;
    //     }
    //   });
    // },
    reRender() {
      console.log("RE RENDER");
      this.render++;
    },
  },
  watch: {
    manualRoute: {
      handler() {
        console.log("CHANGED");
        if (this.mounted) {
          // this.runBuildRoute();
          this.reRender();
        }
      },
      deep: true,
    },
  },
};
</script>

<style>
</style>