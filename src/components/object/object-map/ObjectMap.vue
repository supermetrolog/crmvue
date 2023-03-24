<template>
    <div class="ObjectMap">
        <div class="ObjectMap-description">
            <div class="ObjectMap-description-item" v-if="region">{{ region }}</div>
            <div class="ObjectMap-description-item" v-if="district">{{ district }}</div>
            <div class="ObjectMap-description-item" v-if="districtMoscow">{{ districtMoscow }}</div>
            <div class="ObjectMap-description-item" v-if="direction">{{ direction }}</div>
            <div class="ObjectMap-description-item" v-if="town">{{ town }}</div>
            <div class="ObjectMap-description-item" v-if="highway">{{ highway }}</div>
            <div class="ObjectMap-description-item" v-if="highwayMoscow">{{ highwayMoscow }}</div>
            <div class="ObjectMap-description-item" :title="metro" v-if="metro">
                <div>
                    <img src="../../../assets/image/metro.png" alt="123">
                </div>
                <span>{{ metro }}</span>
            </div>
            <div class="ObjectMap-description-item" v-if="fromMkad">{{ fromMkad }}</div>
        </div>
        <Ymap :manualRoute="manualRoute" />
    </div>
</template>

<script>
import Ymap from '../../common/Ymap.vue'
import './styles.scss'

export default {
    name: 'ObjectMap',
    components: { Ymap },
    props: {
        region: { type: String, default: 'Московская область' },
        district: { type: String, default: 'Северо-восток' },
        districtMoscow: { type: String, default: 'Павловская-Слобода' },
        direction: { type: String, default: 'Симферопольское' },
        town: { type: String, default: 'Московская область' },
        highway: { type: String, default: 'Московская область' },
        highwayMoscow: { type: String, default: 'Московская область' },
        metro: { type: String, default: 'Бабушкинская' },
        fromMkad: {
            type: [String, Number], default: '120 км от МКАД'
        }

    },
    data() {
        return {
        }
    },
    computed: {},
    methods: {}
}
</script>