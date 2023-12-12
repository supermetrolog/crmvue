<template>
    <div></div>
</template>

<script>
export default {
    name: "YandexMapMarker",
    data() {
        return {
            geoObject: null,
        };
    },
    inject: ["add", "remove"],
    props: {
        coords: {
            type: Array,
            required: true,
        },
        markerId: {
            type: [Number, String],
            required: true,
        },
        balloonContentBody: String,
        balloonContentHeader: String,
        balloonContentFooter: String,
        hintContent: String,
    },
    geoObjects: {},
    mounted() {
        this.createGeoObject();
    },
    beforeUnmount() {
        this.removeGeoObject();
    },

    methods: {
        createGeoObject() {
            const marker = {
                type: "Feature",
                id: this.markerId,
                geometry: {type: "Point", coordinates: this.coords},
                properties: {
                    balloonContentHeader: this.balloonContentHeader,
                    balloonContentBody: this.balloonContentBody,
                    balloonContentFooter: this.balloonContentFooter,
                    hintContent: this.hintContent,
                },
                options: {
                    preset: "islands#circleIcon",
                },
            };

            this.$options.geoObjects[this.markerId] = marker;
            this.add(marker);
        },
        removeGeoObject() {
            const thisGeoObject = this.$options.geoObjects[this.markerId];

            if (this.$options.geoObjects && thisGeoObject) {
                this.remove(thisGeoObject);
                delete this.$options.geoObjects[this.markerId];
            }
        },
    },
};
</script>

<style>
</style>