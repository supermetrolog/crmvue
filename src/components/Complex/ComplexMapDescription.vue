<template>
    <div class="complex-map-description">
        <ul class="complex-map-description__list">
            <li
                v-for="(property, key) in properties"
                :key="key"
                class="complex-map-description__item"
            >
                <span class="complex-map-description__name">
                    <i
                        v-if="property.value === 1"
                        class="fa-regular fa-square-check complex-map-description__on"
                    ></i>
                    <i
                        v-else-if="property.value === 2"
                        class="fa-regular fa-square-minus complex-map-description__off"
                    ></i>
                    <i v-else class="fa-regular fa-square"></i>
                    <span>{{ property.name }}</span>
                </span>
                <span class="complex-map-description__value">{{ property.label }}</span>
            </li>
            <li class="complex-map-description__item">
                <span class="complex-map-description__name">Регион ЦИАН</span>
                <span class="complex-map-description__value">{{ cianRegion }}</span>
            </li>
            <li class="complex-map-description__item">
                <span class="complex-map-description__name">Основа (нас. пункт)</span>
                <span v-if="location.townRecord" class="complex-map-description__value">
                    {{ ucFirst(location.townRecord.title) }}
                </span>
            </li>
            <li class="complex-map-description__item">
                <span class="complex-map-description__name">Старый район</span>
                <span v-if="location.district_former" class="complex-map-description__value">
                    {{ ucFirst(location.districtFormerRecord.title) }}
                </span>
            </li>
        </ul>
        <div v-if="location.towns_relevant" class="complex-map-description__block">
            <p class="complex-map-description__subtitle">Показывать в населенных пунктах:</p>
            <ul class="complex-map-description__elements">
                <li
                    v-for="(town, key) in location.townsRelevantRecords"
                    :key="key"
                    class="complex-map-description__element"
                >
                    {{ ucFirst(town.title) }}
                </li>
            </ul>
        </div>
        <div v-if="location.direction_relevant?.length" class="complex-map-description__block">
            <p class="complex-map-description__subtitle">Смежные направления:</p>
            <ul class="complex-map-description__elements">
                <li
                    v-for="(direction, key) in location.direction_relevant"
                    :key="key"
                    class="complex-map-description__element"
                >
                    {{ entityOptions.location.direction[direction] }}
                </li>
            </ul>
        </div>
        <div v-if="location.highways_relevant?.length" class="complex-map-description__block">
            <p class="complex-map-description__subtitle">Смежные шоссе:</p>
            <ul class="complex-map-description__elements">
                <li
                    v-for="(highway, key) in location.highwayRelevantRecords"
                    :key="key"
                    class="complex-map-description__element"
                >
                    {{ ucFirst(highway.title) }}
                </li>
            </ul>
        </div>
        <div
            v-if="location.highways_moscow_relevant?.length"
            class="complex-map-description__block"
        >
            <span class="complex-map-description__subtitle">Доп. шоссе Москвы:</span>
            <ul class="complex-map-description__elements">
                <li
                    v-for="(highway, key) in location.highwayRelevantRecords"
                    :key="key"
                    class="complex-map-description__element"
                >
                    {{ ucFirst(highway.title) }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { entityOptions } from '@/const/options/options';
import { entityProperties } from '@/const/properties/properties';
import { ucFirst } from '@/utils/formatter.js';
import { computed } from 'vue';

const props = defineProps({
    location: {
        type: Object,
        required: true
    }
});

const properties = computed(() => {
    return Object.keys(entityProperties.location.characteristics).map(key => ({
        name: entityProperties.location.characteristics[key].name,
        label: entityOptions.defaults.booleanSimple[props.location[key]] || '-',
        value: props.location[key]
    }));
});

const cianRegion = computed(
    () => entityOptions.location.cianRegion[props.location.cian_region] || '-'
);
</script>
