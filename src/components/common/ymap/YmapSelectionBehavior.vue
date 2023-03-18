<template>
  <div>
    <div class="ymap-selection-behavior-menu">
      <button
        class="ymap-selection-behavior-menu-icon"
        :class="{ active: selectionActive }"
        :disabled="disabledSelectionButton"
        @click="onClickDrawButton"
      >
        <svg
          v-if="!polygonExistsFlag"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
        >
          <g fill="none" fill-rule="evenodd" stroke="currentColor">
            <path stroke-width="2" d="M17 2l5 11-9 9-11-6L4 4z"></path>
            <path
              fill="#FFF"
              d="M3.3 5.348c.716.414 1.634.168 2.048-.55.414-.716.168-1.634-.55-2.048-.716-.414-1.634-.168-2.048.55-.414.716-.168 1.634.55 2.048zm13-2c.716.414 1.634.168 2.048-.55.414-.716.168-1.634-.55-2.048-.716-.414-1.634-.168-2.048.55-.414.716-.168 1.634.55 2.048zm5 11c.716.414 1.634.168 2.048-.55.414-.716.168-1.634-.55-2.048-.716-.414-1.634-.168-2.048.55-.414.716-.168 1.634.55 2.048zm-9 9c.716.414 1.634.168 2.048-.55.414-.716.168-1.634-.55-2.048-.716-.414-1.634-.168-2.048.55-.414.716-.168 1.634.55 2.048zm-11-6c.716.414 1.634.168 2.048-.55.414-.716.168-1.634-.55-2.048-.716-.414-1.634-.168-2.048.55-.414.716-.168 1.634.55 2.048z"
            ></path>
          </g>
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 512 512"
        >
          <path
            class="st0"
            d="M284.3,245.1l110.9-110.9c7.8-7.8,7.8-20.5,0-28.3s-20.5-7.8-28.3,0L256,216.8L145.1,105.9  c-7.8-7.8-20.5-7.8-28.3,0s-7.8,20.5,0,28.3l110.9,110.9L116.9,355.9c-7.8,7.8-7.8,20.5,0,28.3c3.9,3.9,9,5.9,14.1,5.9  c5.1,0,10.2-2,14.1-5.9L256,273.3l110.9,110.9c3.9,3.9,9,5.9,14.1,5.9s10.2-2,14.1-5.9c7.8-7.8,7.8-20.5,0-28.3L284.3,245.1z"
          />
        </svg>
      </button>
    </div>
    <canvas
      ref="canvas"
      style="position: absolute; left: 0; top: 0; display: none"
    ></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectionActive: false,
      disabledSelectionButton: false,
      polygonExistsFlag: false,
    };
  },
  polygon: null,
  props: {
    // Ymap object
    map: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
  },
  methods: {
    drawLineOverMap(map) {
      const canvas = this.$refs.canvas;
      const ctx2d = canvas.getContext("2d");
      let drawing = false;
      let coordinates = [];
      let canvasOptions = {
        strokeStyle: this.options.strokeColor,
        lineWidth: this.options.strokeWidth,
        opacity: this.options.opacity,
      };

      // Задаем размеры канвасу как у карты.
      let rect = map.container.getParentElement().getBoundingClientRect();
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

      canvas.onmousedown = (e) => {
        // При нажатии мыши запоминаем, что мы начали рисовать и координаты.
        drawing = true;
        coordinates.push([e.offsetX, e.offsetY]);
      };

      canvas.onmousemove = (e) => {
        // При движении мыши запоминаем координаты и рисуем линию.
        if (drawing) {
          const last = coordinates[coordinates.length - 1];
          ctx2d.beginPath();
          ctx2d.moveTo(last[0], last[1]);
          ctx2d.lineTo(e.offsetX, e.offsetY);
          ctx2d.stroke();

          coordinates.push([e.offsetX, e.offsetY]);
        }
      };

      return new Promise((resolve) => {
        // При отпускании мыши запоминаем координаты и скрываем канвас.
        canvas.onmouseup = (e) => {
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
    runDraw() {
      this.disableSelectionButton();
      this.drawLineOverMap(this.map).then((coordinates) => {
        coordinates = this.normalizeCoords(coordinates, this.map.getBounds());
        coordinates = this.simplifyCoords(coordinates);
        this.removePolygon();
        this.createPolygon(coordinates);
        this.triggerCreatedPolygonEvenet(coordinates);
        this.toggleSelectionActive();
        this.unDisableSelectionButton();
      });
    },
    // Переводим координаты из 0..1 в географические.
    normalizeCoords(coordinates, bounds) {
      return coordinates.map(function (x) {
        return [
          // latitude.
          // Y переворачивается, т.к. на canvas'е он направлен вниз.
          bounds[0][0] + (1 - x[1]) * (bounds[1][0] - bounds[0][0]),
          // longitude.
          bounds[0][1] + x[0] * (bounds[1][1] - bounds[0][1]),
        ];
      });
    },
    // Упрощение линии, чтобы уменьшить кол-во координат
    simplifyCoords(coordinates) {
      return coordinates.filter(function (_, index) {
        return index % 3 === 0;
      });
    },
    triggerCreatedPolygonEvenet(coordinates) {
      this.$emit("selectionDone", coordinates);
    },
    createPolygon(coordinates) {
      this.$options.polygon = new window.ymaps.Polygon(
        [coordinates],
        {},
        this.options
      );
      this.map.geoObjects.add(this.$options.polygon);
      this.polygonExistsFlag = true;
    },
    removePolygon() {
      if (this.$options.polygon) {
        this.map.geoObjects.remove(this.$options.polygon);
        this.$options.polygon = null;
        this.polygonExistsFlag = false;
      }
    },
    polygonExists() {
      return this.polygonExistsFlag;
    },
    disableSelectionButton() {
      this.disabledSelectionButton = true;
    },
    unDisableSelectionButton() {
      this.disabledSelectionButton = false;
    },
    toggleSelectionActive() {
      this.selectionActive = !this.selectionActive;
    },
    onClickDrawButton() {
      if (!this.polygonExists()) {
        this.runDraw();
        this.toggleSelectionActive();
      }
      this.removePolygon();
    },
  },
};
</script>

<style>
.ymap-container {
  position: relative;
}
.ymap-selection-behavior-menu {
  position: absolute;
  z-index: 1;
  bottom: 70px;
  right: 10px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 30px;
  width: 30px;
  background-color: #fff;
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

.ymap-selection-behavior-menu .ymap-selection-behavior-menu-icon {
  padding: 5px;
  width: 40px;
  height: 35px;
  cursor: pointer;
  color: #7b7b7b;
  background: 0 0;
  border: 0;
  outline-style: none;
}
.ymap-selection-behavior-menu .ymap-selection-behavior-menu-icon:hover {
  color: #000;
}

.ymap-selection-behavior-menu .ymap-selection-behavior-menu-icon.active,
.ymap-selection-behavior-menu .ymap-selection-behavior-menu-icon.active:hover {
  color: #147de8;
}
</style>