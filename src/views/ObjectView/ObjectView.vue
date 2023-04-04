<template>
    <div class="ObjectView">
        <ObjectHeader :name="'СК Северное шереметьево'" :id="4566" :creation-date="'01-02-2014'" :updateDate="'01.01.2043'"
            :consultant="'Матвеев Павел'" :editAccess="false" />
        <ObjectMap :region="'Московская область'" :district="'Северо-восток'" :district-moscow="'Павловская-Слобода'"
            :direction="'Симферопольское'" :town="'Санкт-Петербург'" :highway="'Симферопольское'"
            :highway-moscow="'Киевское'" :metro="'Адмиралтейская'" :from-mkad="228" />
        <ObjectAbout :aboutList="aboutList" />
        <ObjectHoldings :buildings="buildings" :sections="sections" :objectId="objectId" :objectOwners="objectOwners"
            :holdingTypes="holdingTypes" :holdingTypesGeneral="holdingTypesGeneral" :floors="objectFloors" />
    </div>
</template>

<script>
import ObjectHoldings from '../../components/object/object-holdings/ObjectHoldings.vue'
import ObjectAbout from '../../components/object/object-about/ObjectAbout.vue'
import ObjectMap from '../../components/object/object-map/ObjectMap.vue'
import ObjectHeader from '../../components/object/object-header/ObjectHeader.vue'
import './styles.scss'
export default {
    name: 'ObjectView',
    components: { ObjectHeader, ObjectMap, ObjectAbout, ObjectHoldings },
    data() {
        return {
            aboutList: [
                [
                    { name: 'S - участка общая', value: 449750, unitType: 1 },
                    { name: 'S - строений в комплексе', value: 449750, unitType: 2 },
                    { name: 'Управляющая компания', value: 449750 },
                ],
                [
                    { name: 'S - участка общая', value: 449750, unitType: 1 },
                    { name: 'S - строений в комплексе', value: 449750, unitType: 2 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                ],
                [
                    { name: 'S - участка общая', value: 449750, unitType: 1 },
                    { name: 'S - строений в комплексе', value: 449750, unitType: 2 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                ],
                [
                    { name: 'S - участка общая', value: 449750, unitType: 1 },
                    { name: 'S - строений в комплексе', value: 449750, unitType: 2 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                ],
                [
                    { name: 'S - участка общая', value: 449750, unitType: 1 },
                    { name: 'S - строений в комплексе', value: 449750, unitType: 2 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                    { name: 'S - участка общая', value: 449750, unitType: 1 },
                    { name: 'S - строений в комплексе', value: 449750, unitType: 2 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                ],
            ],
            objectOwners: [{ name: 'ОАО Матье Бал', rating: 3, contacts: [1], requests: [1, 2, 3], objects: [1, 2, 3, 4, 5], },
            { name: 'ЗАО Тсослю Бойво Pros.', rating: 1, contacts: [1, 2, 3], requests: [1, 2, 3], objects: [1], },
            { name: 'ЗАО Тсослю Бойво Pros.', rating: 5, contacts: [1, 2, 3, 4, 5], requests: [1], objects: [1, 2, 3, 4, 5], },
            { name: 'ЗАО Тсослю Бойво Pros.', rating: 3, contacts: [1], requests: [1, 2, 3, 4, 5], objects: [1, 2, 3], },],
            holdingTypes: [{ "id": 644760, "request_id": 9520, "object_type": 4 }, { "id": 644761, "request_id": 9520, "object_type": 0 }, { "id": 644762, "request_id": 9520, "object_type": 6 }, { "id": 644763, "request_id": 9520, "object_type": 7 }, { "id": 644764, "request_id": 9520, "object_type": 21 }, { "id": 644765, "request_id": 9520, "object_type": 23 }, { "id": 644766, "request_id": 9520, "object_type": 25 }, { "id": 644767, "request_id": 9520, "object_type": 27 }],
            holdingTypesGeneral: [{ "id": 21074, "request_id": 9520, "type": 0 }, { "id": 21075, "request_id": 9520, "type": 1 }, { "id": 21076, "request_id": 9520, "type": 2 }],
            objectFloors: [
                { number: -1, danger: true },
                { number: 1, danger: false },
                { number: 2, danger: false },
            ],
            buildings: [1, 2, 3],
            sections: [1, 2, 3, 4],
            objectId: 1488,
        }
    },
    computed: {},
    methods: {}
}
</script>
