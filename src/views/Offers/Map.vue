<template>
    <div></div>
</template>

<script setup>
import { dealOptions } from '@/const/options/deal.options.js';
import { objectOptions } from '@/const/options/object.options.js';
import { ActivePassiveFUCK, GateTypeList, YesNo } from '@/const/const.js';
import { defaultsOptions } from '@/const/options/options.js';
import { floorOptions } from '@/const/options/floor.options.js';
import { locationOptions } from '@/const/options/location.options.js';

const gettersForFilters = {
    rangeMinElectricity: value => value + ' кВт',
    rangeMaxDistanceFromMKAD: value => value + ' км',
    deal_type: value => dealOptions.type[Number(value) + 1].toUpperCase(),
    agent_id: value => {
        // if (!consultantsOptions.value.length) return null;
        //
        // const consultantIndex = consultantsOptions.value.findIndex(
        //     element => (element.value = value)
        // );
        //
        // if (consultantIndex !== -1) return consultantsOptions.value[consultantIndex].label;

        return value;
    },
    rangeMinArea: value => value + ' м<sup>2</sup>',
    rangeMaxArea: value => value + ' м<sup>2</sup>',
    rangeMinPricePerFloor: value => value + ' р',
    rangeMaxPricePerFloor: value => value + ' р',
    rangeMinCeilingHeight: value => value + ' м',
    rangeMaxCeilingHeight: value => value + ' м',
    class: value => {
        if (!value) return null;
        if (!Array.isArray(value)) value = [value];
        return value.map(elem => objectOptions.class[elem]).join(', ');
    },
    gates: value => {
        if (!value) return null;
        if (!Array.isArray(value)) value = [value];
        return value.map(elem => GateTypeList[elem]).join(', ');
    },
    heated: value => {
        if (!value) return null;
        return defaultsOptions.booleanSimple[value];
    },
    floor_types: value => {
        if (!value) return null;
        if (!Array.isArray(value)) value = [value];
        return value.map(elem => floorOptions.floorTypes[elem]).join(', ');
    },
    purposes: value => {
        if (!value) return null;
        if (!Array.isArray(value)) value = [value];
        return value
            .map(element => {
                const param = objectOptions.purposes[element];
                return `<i title="${param.name}"" class="' ${param.icon} '"></i>`;
            })
            .join(', ');
    },
    object_type: value => {
        if (!value) return null;
        if (!Array.isArray(value)) value = [value];
        return value.map(element => objectOptions.typeGeneral[element - 1].name).join(', ');
    },
    region: value => {
        // if (!value || !store.getters.REGION_LIST) return null;
        // const result = store.getters.REGION_LIST.find(region => region.value == value).label;

        // if (route.query.polygon) {
        //     return '<p class="text-danger">' + result + '</p>';
        // }

        return value;
    },
    district_moscow: value => {
        if (!value) return null;
        if (!Array.isArray(value)) value = [value];
        const result = value.map(key => locationOptions.district[key]).join(', ');

        // if (route.query.polygon) {
        //     return '<p class="text-danger">' + result + '</p>';
        // }

        return result;
    },
    direction: value => {
        if (!value) return null;
        if (!Array.isArray(value)) value = [value];
        const result = value.map(elem => locationOptions.directionWithShort[elem].full).join(', ');

        // if (route.query.polygon) {
        //     return '<p class="text-danger">' + result + '</p>';
        // }

        return result;
    },
    status: value => {
        if (!value) return null;
        return ActivePassiveFUCK[value];
    },
    ad_realtor: value => {
        if (!value) return null;
        return YesNo[value];
    },
    ad_cian: value => {
        if (!value) return null;
        return YesNo[value];
    },
    ad_yandex: value => {
        if (!value) return null;
        return YesNo[value];
    },
    ad_free: value => {
        if (!value) return null;
        return YesNo[value];
    },
    ad_avito: value => {
        if (!value) return null;
        return YesNo[value];
    },
    sort: value => value
};
</script>
