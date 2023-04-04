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
        }
    },
    data() {
        return {
            objectOwners: [{ name: 'ОАО Матье Бал', rating: 3, contacts: [1], requests: [1, 2, 3], objects: [1, 2, 3, 4, 5], },
            { name: 'ЗАО Тсослю Бойво Pros.', rating: 1, contacts: [1, 2, 3], requests: [1, 2, 3], objects: [1], },
            { name: 'ЗАО Тсослю Бойво Pros.', rating: 5, contacts: [1, 2, 3, 4, 5], requests: [1], objects: [1, 2, 3, 4, 5], },
            { name: 'ЗАО Тсослю Бойво Pros.', rating: 3, contacts: [1], requests: [1, 2, 3, 4, 5], objects: [1, 2, 3], },],
            holdingTypes: [{ "id": 644760, "request_id": 9520, "object_type": 4 }, { "id": 644761, "request_id": 9520, "object_type": 0 }, { "id": 644762, "request_id": 9520, "object_type": 6 }, { "id": 644763, "request_id": 9520, "object_type": 7 }, { "id": 644764, "request_id": 9520, "object_type": 21 }, { "id": 644765, "request_id": 9520, "object_type": 23 }, { "id": 644766, "request_id": 9520, "object_type": 25 }, { "id": 644767, "request_id": 9520, "object_type": 27 }],
            holdingTypesGeneral: [{ "id": 21074, "request_id": 9520, "type": 0 }, { "id": 21075, "request_id": 9520, "type": 1 }, { "id": 21076, "request_id": 9520, "type": 2 }],
            floors: [
                { number: -1, danger: true },
                { number: 1, danger: false },
                { number: 2, danger: false },
            ]
        }
    },
}
</script>

<style lang="scss" scoped></style>