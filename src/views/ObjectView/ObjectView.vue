<template>
    <div class="ObjectView">
        <ObjectHeader :name="'СК Северное шереметьево'" :id="4566" :creation-date="'01-02-2014'" :updateDate="'01.01.2043'"
            :consultant="'Матвеев Павел'" :editAccess="false" />
        <ObjectMap :region="'Московская область'" :district="'Северо-восток'" :district-moscow="'Павловская-Слобода'"
            :direction="'Симферопольское'" :town="'Санкт-Петербург'" :highway="'Симферопольское'"
            :highway-moscow="'Киевское'" :metro="'Адмиралтейская'" :from-mkad="228" />
        <ObjectAbout />
    </div>
</template>

<script>
import ObjectAbout from '../../components/object/object-about/ObjectAbout.vue'
import ObjectMap from '../../components/object/object-map/ObjectMap.vue'
import ObjectHeader from '../../components/object/object-header/ObjectHeader.vue'
import './styles.scss'
export default {
    name: 'ObjectView',
    components: { ObjectHeader, ObjectMap, ObjectAbout },
    data() {
        return {}
    },
    computed: {},
    methods: {

    }
}
</script>
