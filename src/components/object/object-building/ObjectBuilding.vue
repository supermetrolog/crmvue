<template>
    <div class="ObjectBuilding">
        <div class="ObjectBuilding-header">
            <span class="ObjectBuilding-header-name">
                СТРОЕНИЯ
                <template v-if="buildings.length > 0">
                    {{ `(${buildings.length})` }}, </template>
                УЧАСТКИ
                <template v-if="sections.length > 0">
                    {{ `(${sections.length})` }}</template>
            </span>
            <div class="ObjectBuilding-header-labels"></div>
        </div>
        <div class="ObjectBuilding-content">
            <Carousel />
        </div>
    </div>
</template>

<script>
import Carousel from '../../common/carousel/Carousel.vue'
import './styles.scss'

export default {
    name: 'ObjectBuilding',
    components: { Carousel },
    props: {
        buildings: {
            type: Array,
            default: () => [1, 2, 3]
        },
        sections: {
            type: Array,
            default: () => [1, 2]
        },
    },
    data() {
        return {}
    },
}
</script>

<style lang="scss" scoped></style>