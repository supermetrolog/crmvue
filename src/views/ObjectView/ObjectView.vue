<template>
    <div class="ObjectView">
        <ObjectHeader />
        <ObjectMap />
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
