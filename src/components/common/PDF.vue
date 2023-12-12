<template>
    <div class="pdf-content">
        <div class="page">
            <div class="row no-gutters">
                <div class="col-6">
                    <img
                        src="https://lh3.googleusercontent.com/proxy/22sXssY5jaCmLkE8DJrgUHEdcUQYatq0Py6r0s0wk9rdnP7t7vBdTDqb7ONbdkRNKVSIJ_LhUpneWUgBpUfR0MuUbD5YpNJ1whEGmCcy1tkavJCP4lGr4g"
                        alt=""
                    />
                </div>
                <div class="col-6">
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
            </div>
        </div>
    </div>
</template>

<script>
import {yandexMap, loadYmap} from "vue-yandex-maps";

export default {
    name: "PDF",
    components: {
        yandexMap,
    },
    data() {
        return {
            array: [
                {name: "fuck"},
                {name: "fuck"},
                {name: "fuck"},
                {name: "fuck"},
                {name: "fuck"},
                {name: "fuck"},
                {name: "fuck"},
                {name: "fuck"},
                {name: "fuck"},
                {name: "fuck"},
                {name: "fuck"},
                {name: "fuck"},
                {name: "fuck"},
                {name: "fuck"},
                {name: "fuck"},
                {name: "fuck"},
                {name: "fuck"},
                {name: "fuck"},
                {name: "fuck"},
                {name: "fuck"},
            ],
            mounted: false,
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
    async mounted() {
        await loadYmap({...this.settings, debug: true});
        setTimeout(() => {
            this.mounted = true;
        }, 1000);
    },
};
</script>

<style lang="scss" scoped>
.pdf-content {
    /* max-width: 800px; */
    width: 100%;
    background-color: red;

    .page {
        max-height: 1122px;
        min-height: 200px;
        height: 100%;
        overflow: hidden;
        background-color: #ccc;

        a,
        p,
        h1 {
            background-color: yellow;
        }
    }
}
</style>