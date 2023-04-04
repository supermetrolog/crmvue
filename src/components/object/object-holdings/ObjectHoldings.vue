<template>
    <div class="ObjectHoldings">
        <div class="ObjectHoldings-header">
            <span class="ObjectHoldings-header-name">
                СТРОЕНИЯ
                <template v-if="buildings.length > 0">
                    {{ `(${buildings.length})` }}, </template>
                УЧАСТКИ
                <template v-if="sections.length > 0">
                    {{ `(${sections.length})` }}</template>
            </span>
            <div class="ObjectHoldings-header-labels"></div>
        </div>
        <div class="ObjectHoldings-body">
            <div class="ObjectHoldings-carousel">
                <Carousel />
                <div class="ObjectHoldings-carousel-label">
                    <span>ID {{ objectId }}</span>
                </div>
            </div>
            <div class="ObjectHoldings-info">
                <div class="ObjectHoldings-info-left">
                    <ObjectHoldingsParameters :holdingTypes="holdingTypes" :holdingTypesGeneral="holdingTypesGeneral"
                        :floors="floors" />
                </div>
                <div class="ObjectHoldings-info-right">
                    <ObjectHoldingsOwnerList :owners="objectOwners" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ObjectHoldingsParameters from './object-holdings-parameters/ObjectHoldingsParameters.vue'
import ObjectHoldingsOwnerList from './object-holdings-owners/ObjectHoldingsOwnerList.vue'
import Carousel from '../../common/carousel/Carousel.vue'
import './styles.scss'

export default {
    name: 'ObjectHoldings',
    components: { Carousel, ObjectHoldingsOwnerList, ObjectHoldingsParameters },
    props: {
        buildings: {
            type: Array,
            default: () => [1, 2, 3]
        },
        sections: {
            type: Array,
            default: () => [1, 2]
        },
        objectId: {
            type: Number,
            default: 1488
        },
        objectOwners: {
            type: Array,
            default: () => []
        },
        holdingTypes: {
            type: Array,
            default: () => []
        },
        holdingTypesGeneral: {
            type: Array,
            default: () => []
        },
        floors: {
            type: Array,
            default: () => []
        },

    },
    data() {
        return {
        }
    },
}
</script>

<style lang="scss" scoped></style>