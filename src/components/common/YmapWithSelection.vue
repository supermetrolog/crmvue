<template>
  <div class="ymap" :key="render">
    <div class="max-size-btn">
      <i class="far fa-arrow-alt-circle-up" v-if="openned" @click="close"></i>
      <i class="far fa-arrow-alt-circle-down" v-else @click="open"></i>
    </div>
    <yandex-map
      v-if="mounted"
      :settings="settings"
      :options="options.mapOptions"
      :coords="options.coords"
      :zoom="options.zoom"
      :controls="options.controls"
      :detailed-controls="options.detailedControls"
      :behaviors="options.behaviors"
      :cluster-options="options.clusterOptions"
      ref="map"
      :style="styles"
    >
      <div class="mapMenu">
        <div class="title">Выделение области:</div>

        <button
          class="mapMenuIcon"
          id="draw_line"
          :class="{ active: selectionActive }"
          @click="toggleSelectionActive"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 25 25"
          >
            <g fill="none" fill-rule="evenodd" stroke="currentColor">
              <path stroke-width="2" d="M17 2l5 11-9 9-11-6L4 4z"></path>
              <path
                fill="#FFF"
                d="M3.3 5.348c.716.414 1.634.168 2.048-.55.414-.716.168-1.634-.55-2.048-.716-.414-1.634-.168-2.048.55-.414.716-.168 1.634.55 2.048zm13-2c.716.414 1.634.168 2.048-.55.414-.716.168-1.634-.55-2.048-.716-.414-1.634-.168-2.048.55-.414.716-.168 1.634.55 2.048zm5 11c.716.414 1.634.168 2.048-.55.414-.716.168-1.634-.55-2.048-.716-.414-1.634-.168-2.048.55-.414.716-.168 1.634.55 2.048zm-9 9c.716.414 1.634.168 2.048-.55.414-.716.168-1.634-.55-2.048-.716-.414-1.634-.168-2.048.55-.414.716-.168 1.634.55 2.048zm-11-6c.716.414 1.634.168 2.048-.55.414-.716.168-1.634-.55-2.048-.716-.414-1.634-.168-2.048.55-.414.716-.168 1.634.55 2.048z"
              ></path>
            </g>
          </svg>
        </button>
      </div>

      <canvas
        id="draw-canvas"
        style="position: absolute; left: 0; top: 0; display: none"
      ></canvas>
      <ymap-marker
        v-for="offer in list"
        :key="offer.complex_id"
        :marker-id="offer.complex_id"
        :coords="[offer.latitude, offer.longitude]"
        :use-html-in-layout="true"
        :balloon="{
          header: 'ID: ' + offer.complex_id,
          body: offer.address,
          footer: getFooter(offer),
        }"
        :icon="{ color: getMarkerColor(offer) }"
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
      selectionActive: false,
      render: 0,
      mounted: false,
      styles: {
        width: "100%",
        height: "500px",
      },
      openned: false,
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
        mapOptions: {
          suppressObsoleteBrowserNotifier: true,
          suppressMapOpenBlock: true,
        },
        controls: ["mediumMapDefaultSet"],
        detailedControls: {
          zoomControl: {
            position: {
              right: "10px",
              top: "100px",
            },
          },
        },
        behaviors: ["drag", "multiTouch"],
        clusterOptions: {
          1: {
            clusterDisableClickZoom: false,
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
  async mounted() {
    await loadYmap({ ...this.settings, debug: true });
    this.mounted = true;
    this.reRender();
    setTimeout(() => {
      this.initAreaSelection();
    }, 500);
  },
  methods: {
    initAreaSelection() {
      let polygonOptions = {
        strokeColor: "#1679e7",
        fillColor: "#a2c9d8",
        interactivityModel: "default#transparent",
        strokeWidth: 4,
        opacity: 0.7,
      };

      console.log(this.$refs);
      const map = this.$refs.map.$options.static.myMap;
      var polygon = null;

      var drawButton = document.querySelector("#draw_line");

      drawButton.onclick = () => {
        drawButton.disabled = true;

        this.drawLineOverMap(map).then((coordinates) => {
          // Переводим координаты из 0..1 в географические.
          var bounds = map.getBounds();
          coordinates = coordinates.map(function (x) {
            return [
              // Широта (latitude).
              // Y переворачивается, т.к. на canvas'е он направлен вниз.
              bounds[0][0] + (1 - x[1]) * (bounds[1][0] - bounds[0][0]),
              // Долгота (longitude).
              bounds[0][1] + x[0] * (bounds[1][1] - bounds[0][1]),
            ];
          });

          // Тут надо симплифицировать линию.
          // Для простоты я оставляю только каждую третью координату.
          coordinates = coordinates.filter(function (_, index) {
            return index % 3 === 0;
          });

          // Удаляем старый полигон.
          if (polygon) {
            map.geoObjects.remove(polygon);
          }

          // Создаем новый полигон
          polygon = new window.ymaps.Polygon([coordinates], {}, polygonOptions);
          map.geoObjects.add(polygon);

          drawButton.disabled = false;
          console.log(coordinates);
          // На этом этапе переменная coordinates содержит координаты всех точек фигуры
          this.toggleSelectionActive();
        });
      };
    },
    drawLineOverMap(map) {
      var canvas = document.querySelector("#draw-canvas");
      var ctx2d = canvas.getContext("2d");
      var drawing = false;
      var coordinates = [];
      let canvasOptions = {
        strokeStyle: "#1679e7",
        lineWidth: 4,
        opacity: 0.7,
      };

      // Задаем размеры канвасу как у карты.
      var rect = map.container.getParentElement().getBoundingClientRect();
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Применяем стили.
      ctx2d.strokeStyle = canvasOptions.strokeStyle;
      ctx2d.lineWidth = canvasOptions.lineWidth;
      canvas.style.opacity = canvasOptions.opacity;

      ctx2d.clearRect(0, 0, canvas.width, canvas.height);

      // Показываем канвас. Он будет сверху карты из-за position: absolute.
      canvas.style.display = "block";

      canvas.onmousedown = function (e) {
        // При нажатии мыши запоминаем, что мы начали рисовать и координаты.
        drawing = true;
        coordinates.push([e.offsetX, e.offsetY]);
      };

      canvas.onmousemove = function (e) {
        // При движении мыши запоминаем координаты и рисуем линию.
        if (drawing) {
          var last = coordinates[coordinates.length - 1];
          ctx2d.beginPath();
          ctx2d.moveTo(last[0], last[1]);
          ctx2d.lineTo(e.offsetX, e.offsetY);
          ctx2d.stroke();

          coordinates.push([e.offsetX, e.offsetY]);
        }
      };

      return new Promise(function (resolve) {
        // При отпускании мыши запоминаем координаты и скрываем канвас.
        canvas.onmouseup = function (e) {
          coordinates.push([e.offsetX, e.offsetY]);
          canvas.style.display = "none";
          drawing = false;

          coordinates = coordinates.map(function (x) {
            return [x[0] / canvas.width, x[1] / canvas.height];
          });

          resolve(coordinates);
        };
      });
    },
    toggleSelectionActive() {
      this.selectionActive = !this.selectionActive;
    },
    getMarkerColor(offer) {
      if (offer.test_only == 1) {
        return "grey";
      }
      return "red";
    },
    getFooter(offer) {
      let template = `<a href="${this.getOfferUrl(
        offer
      )}" target="_blank" class="photo">
              <div class="image-container">
                <img src="${offer.thumb}" alt="image" />
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
      return this.$apiUrlHelper.generator().objectUrl(offer.complex_id);
    },
    open() {
      console.log("OPEN");
      this.openned = true;
      this.styles.height = "800px";
    },
    close() {
      console.log("CLOSE");
      this.styles.height = "100px";
      this.openned = false;
    },
    reRender() {
      console.log("RE RENDER");
      this.render++;
    },
  },
  watch: {
    list: {
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
.ymap-container {
  position: relative;
}
.mapMenu {
  position: absolute;
  z-index: 1;
  top: 20px;
  left: calc(50% - 130px);
  padding: 0 15px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 46px;
  background-color: #fff;
  border-radius: 24px;
  -webkit-box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.25);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.25);
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
}

.mapMenu .title {
  padding: 0 10px;
  font-size: 14px;
  line-height: 1.57;
  color: #505152;
}

.mapMenu .mapMenuIcon {
  padding: 5px;
  width: 40px;
  height: 35px;
  cursor: pointer;
  color: #7b7b7b;
  background: 0 0;
  border: 0;
  outline-style: none;
}
.mapMenu .mapMenuIcon:hover {
  color: #000;
}

.mapMenu .mapMenuIcon.active,
.mapMenu .mapMenuIcon.active:hover {
  color: #147de8;
}
</style>