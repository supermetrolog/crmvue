<template>
    <div class="object-holding-parameters__floors">
        <ul class="object-holding-parameters__floors-list">
            <li
                v-for="floor in preparedFloors"
                :key="floor.number.id"
                v-tippy="floor.shouldBeFilled ? 'Необходимо заполнить данные' : undefined"
                @click.prevent="handleClick(floor)"
                class="object-holding-parameters__floor"
                :class="{ danger: floor.shouldBeFilled }"
            >
                <span>{{ floor.number }}</span>
                <i
                    v-if="floor.shouldBeFilled"
                    class="fas fa-exclamation-circle text-danger"
                    title="Внимание"
                />
            </li>
        </ul>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { floorBuildingOptions } from '@/const/options/floor.options.js';

const emit = defineEmits(['fill', 'edit']);
const props = defineProps({
    floors: {
        type: Array,
        default: () => []
    },
    floorsBuilding: {
        type: Array,
        default: () => []
    }
});

const preparedFloors = computed(() => {
    return props.floorsBuilding.reduce((acc, floor) => {
        const originalFloor = props.floors.find(element => element.number?.id === floor);
        if (originalFloor)
            acc.push({
                numberID: floor,
                number: floorBuildingOptions[floor],
                floor: originalFloor
            });
        else
            acc.push({
                numberID: floor,
                number: floorBuildingOptions[floor],
                shouldBeFilled: true
            });

        return acc;
    }, []);
});

const handleClick = floor => {
    if (floor.shouldBeFilled) emit('fill', floor.numberID);
    else emit('edit', floor.floor);
};
</script>
