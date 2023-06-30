<template>
  <div>
    <canvas
      ref="canvas"
      class="canvas"
      style="position: absolute; left: 0; top: 0;"
    ></canvas>
  </div>
</template>

<script>
export default {
  polygon: null,
  btn: null,
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
    coordinates: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.addSelectionControllButton();
    this.addPolygonIfExistsCoordinates();
  },
  methods: {
    addPolygonIfExistsCoordinates() {
      this.removePolygon();
      if (this.coordinates.length) {
        this.createPolygon(this.coordinates);
      }
    },
    addSelectionControllButton() {
      this.map.controls.add(this.getBtn(), {
        float: "right",
      });
    },
    getBtn() {
      if (this.$options.btn) {
        return this.$options.btn;
      }
      this.$options.btn = new window.ymaps.control.Button({
        data: {
          // Изображение иконки кнопки.
          content: `<svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="-2 -2 28 28"
        >
          <g fill="none" fill-rule="evenodd" stroke="currentColor">
            <path stroke-width="2" d="M17 2l5 11-9 9-11-6L4 4z"></path>
            <path
              fill="#FFF"
              d="M3.3 5.348c.716.414 1.634.168 2.048-.55.414-.716.168-1.634-.55-2.048-.716-.414-1.634-.168-2.048.55-.414.716-.168 1.634.55 2.048zm13-2c.716.414 1.634.168 2.048-.55.414-.716.168-1.634-.55-2.048-.716-.414-1.634-.168-2.048.55-.414.716-.168 1.634.55 2.048zm5 11c.716.414 1.634.168 2.048-.55.414-.716.168-1.634-.55-2.048-.716-.414-1.634-.168-2.048.55-.414.716-.168 1.634.55 2.048zm-9 9c.716.414 1.634.168 2.048-.55.414-.716.168-1.634-.55-2.048-.716-.414-1.634-.168-2.048.55-.414.716-.168 1.634.55 2.048zm-11-6c.716.414 1.634.168 2.048-.55.414-.716.168-1.634-.55-2.048-.716-.414-1.634-.168-2.048.55-.414.716-.168 1.634.55 2.048z"
            ></path>
          </g>
        </svg>`,
          title: "Selection",
        },
        options: {
          maxWidth: [28],
        },
      });

      this.$options.btn.events.add("click", this.onClickDrawButton);

      return this.$options.btn;
    },
    drawLineOverMap(map) {
      const canvas = document.getElementsByClassName('canvas')[0];
      const ctx2d = canvas.getContext("2d");
      const canvasOptions = {
        strokeStyle: this.options.strokeColor,
        lineWidth: this.options.strokeWidth,
        opacity: this.options.opacity,
      };
      let coordinates = [];
      let drawing = false;

      // Задаем размеры канвасу как у карты.
      const rect = map.container.getParentElement().getBoundingClientRect();
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
      this.drawLineOverMap(this.map).then((coordinates) => {
        coordinates = this.normalizeCoords(coordinates, this.map.getBounds());
        coordinates = this.simplifyCoords(coordinates);
        this.removePolygon();
        // this.createPolygon(coordinates);
        this.triggerCreatedPolygonEvenet(coordinates);
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
      return coordinates.filter(
        (_, index) => index % this.options.accuracy === 0
      );
    },
    triggerCreatedPolygonEvenet(coordinates) {
      this.$emit("selectionDone", coordinates);
    },
    triggerRemovedPolygonEvenet() {
      this.$emit("removedDone");
    },
    toggleBtn(active) {
      this.getBtn().state.set("selected", active);
    },
    zoomToPolygon(coordinates) {
      this.map.setCenter(
        this.getCenterOfPolygon(coordinates),
        this.options.polygonZoom,
        {
          duration: this.options.polygonZoomDuration,
        }
      );
    },
    getCenterOfPolygon(polygon) {
      const PI = 22 / 7;
      let X = 0;
      let Y = 0;
      let Z = 0;
      polygon.forEach(function (coords) {
        let lat1 = coords[0];
        let lon1 = coords[1];
        lat1 = (lat1 * PI) / 180;
        lon1 = (lon1 * PI) / 180;
        X += Math.cos(lat1) * Math.cos(lon1);
        Y += Math.cos(lat1) * Math.sin(lon1);
        Z += Math.sin(lat1);
      });

      let Lon = Math.atan2(Y, X);
      let Hyp = Math.sqrt(X * X + Y * Y);
      let Lat = Math.atan2(Z, Hyp);
      Lat = (Lat * 180) / PI;
      Lon = (Lon * 180) / PI;
      return [Lat, Lon];
    },
    createPolygon(coordinates) {
      this.$options.polygon = new window.ymaps.Polygon(
        [coordinates],
        {},
        this.options
      );
      this.map.geoObjects.add(this.$options.polygon);
      this.toggleBtn(true);
      this.zoomToPolygon(coordinates);
    },
    removePolygon() {
      if (this.$options.polygon) {
        this.map.geoObjects.remove(this.$options.polygon);
        this.$options.polygon = null;
      }
      this.toggleBtn(false);
    },
    polygonAlreadyExists() {
      return !!this.$options.polygon;
    },
    onClickDrawButton() {
      if (!this.polygonAlreadyExists()) {
        this.runDraw();
      }
      this.removePolygon();
      this.triggerRemovedPolygonEvenet();
    },
  },
  watch: {
    coordinates: {
      handler() {
        this.addPolygonIfExistsCoordinates();
      },
      deep: true,
    },
  },
};
</script>

<style>
/* Нужно для правильного позицианирования */
.ymap-container {
  position: relative;
}
[class$="float-button-text"] {
  padding: 0 !important;
}
.canvas {
  display: none;
}
</style>