<template>
  <div class="calendar">
    <h1>Calendar</h1>
    <Ymap
      :settings="{
        apiKey: '59572809-066b-46d5-9e5d-269a65751b84',
        lang: 'ru_RU',
        coordorder: 'latlong',
        enterprise: false,
        version: '2.1',
        fullscreenControl: false,
      }"
      :controls="[
        'geolocationControl',
        'searchControl',
        'trafficControl',
        'typeSelector',
        'zoomControl',
        'rulerControl',
      ]"
      :behaviors="['drag', 'scrollZoom', 'multiTouch', 'selection']"
    />
  </div>
</template>

<script>
import Ymap from "@/components/common/ymap/Ymap";
export default {
  name: "Calendar",
  components: {
    Ymap,
  },
  mounted() {},
};
</script>
