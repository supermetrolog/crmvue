<template>
    <div class="ObjectHoldingsParameters">
        <div class="ObjectHoldingsParameters-main">
            <p class="ObjectHoldingsParameters-main-area">12652 м<sup>2</sup> (по этажам: 12662 м<sup>2</sup>)</p>
            <span class="ObjectHoldingsParameters-main-address">Московская область, Фрязино, Свидетельская 34</span>
        </div>
        <div class="ObjectHoldingsParameters-types" v-if="holdingTypes">
            <div v-if="holdingTypes.length > 0">
                <strong class="object-type-box" v-for="objectType of holdingTypes" :key="objectType.id"
                    :title="getObjectTypeName(objectType.object_type)">
                    <i :class="getObjectTypeIcon(objectType.object_type)"></i>
                </strong>
            </div>
            <!-- <div v-if="holdingTypesGeneral.length > 0">
                <strong>{{
                    getObjectTypesGeneral(holdingTypesGeneral)
                }}</strong>
            </div> -->
            <div v-if="
                holdingTypes.length == 0 && holdingTypesGeneral.length == 0
            ">
                <p>нет данных</p>
            </div>
        </div>
    </div>
    <div class="ObjectHoldingsParameters-floors" v-if="floors.length > 0">
        <div class="ObjectHoldingsParameters-floor" :class="{ danger: floor.danger }" v-for="floor in floors"
            :key="floor.number">
            <span>{{ floor.number }} этаж</span>
            <i class="fas fa-exclamation-circle text-danger" v-if="floor.danger" title="Внимание"></i>
        </div>
    </div>
</template>

<script>
import {
    ObjectTypeList,
    // ObjectTypesGeneralList
} from "@/const/Const.js";
import './styles.scss'
export default {
    name: 'ObjectHoldingsParameters',
    components: {},
    props: {
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
        }
    },
    data() {
        return {
            objectTypeListWareHouse: ObjectTypeList.get("warehouse"),
            objectTypeListProduction: ObjectTypeList.get("production"),
            objectTypeListPlot: ObjectTypeList.get("plot"),
            // objectTypesGeneralList: ObjectTypesGeneralList.get("param"),
        }
    },
    methods: {
        getObjectTypeIcon(objectType) {
            if (objectType < 12) {
                return this.objectTypeListWareHouse.find(
                    (item) => item[0] == objectType
                )[1].icon;
            }
            if (objectType < 25) {
                return this.objectTypeListProduction.find(
                    (item) => item[0] == objectType
                )[1].icon;
            }
            return this.objectTypeListPlot.find((item) => item[0] == objectType)[1]
                .icon;
        },
        getObjectTypeName(objectType) {
            if (objectType < 12) {
                return this.objectTypeListWareHouse.find(
                    (item) => item[0] == objectType
                )[1].name;
            }
            if (objectType < 25) {
                return this.objectTypeListProduction.find(
                    (item) => item[0] == objectType
                )[1].name;
            }
            return this.objectTypeListPlot.find((item) => item[0] == objectType)[1]
                .name;
        },
        // getObjectTypesGeneral(types) {
        //     return types
        //         .map((type) => type.type)
        //         .map(
        //             (type) =>
        //                 this.objectTypesGeneralList.find((item) => item[0] == type)[1]
        //         )
        //         .join(", ");
        // },
    }
}
</script>