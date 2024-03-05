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
                    {{ $formatter.text().ucFirst(location.townRecord.title) }}
                </span>
            </li>
            <li class="complex-map-description__item">
                <span class="complex-map-description__name">Старый район</span>
                <span v-if="location.district_former" class="complex-map-description__value">
                    {{ $formatter.text().ucFirst(location.districtFormerRecord.title) }}
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
                    {{ $formatter.text().ucFirst(town.title) }}
                </li>
            </ul>
        </div>
        <div v-if="location.direction_relevant.length" class="complex-map-description__block">
            <p class="complex-map-description__subtitle">Смежные направления:</p>
            <ul class="complex-map-description__elements">
                <li
                    v-for="(direction, key) in location.direction_relevant"
                    :key="key"
                    class="complex-map-description__element"
                >
                    {{ directionOptions[direction] }}
                </li>
            </ul>
        </div>
        <div v-if="location.highways_relevant.length" class="complex-map-description__block">
            <p class="complex-map-description__subtitle">Смежные шоссе:</p>
            <ul class="complex-map-description__elements">
                <li
                    v-for="(highway, key) in location.highwayRelevantRecords"
                    :key="key"
                    class="complex-map-description__element"
                >
                    {{ $formatter.text().ucFirst(highway.title) }}
                </li>
            </ul>
        </div>
        <div v-if="location.highways_moscow_relevant.length" class="complex-map-description__block">
            <span class="complex-map-description__subtitle">Доп. шоссе Москвы:</span>
            <ul class="complex-map-description__elements">
                <li
                    v-for="(highway, key) in location.highwayRelevantRecords"
                    :key="key"
                    class="complex-map-description__element"
                >
                    {{ $formatter.text().ucFirst(highway.title) }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { entityOptions } from '@/const/options/options';
import { entityProperties } from '@/const/properties/properties';

export default {
    name: 'ComplexMapDescription',
    props: {
        location: {
            type: Object,
            required: true
        }
    },
    data() {},
    computed: {
        directionOptions() {
            return entityOptions.location.direction;
        },
        properties() {
            return Object.keys(entityProperties.location.characteristics).map(key => ({
                name: entityProperties.location.characteristics[key].name,
                label: entityOptions.defaults.booleanSimple[this.location[key]] || '-',
                value: this.location[key]
            }));
        },
        cianRegion() {
            return entityOptions.location.cianRegion[this.location.cian_region] || '-';
        }
    },
    methods: {}
};
</script>
