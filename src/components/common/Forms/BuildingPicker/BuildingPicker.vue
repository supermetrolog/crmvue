<template>
    <div class="building-picker">
        <div class="building-picker__header mb-2">
            <DashboardChip class="dashboard-bg-light">
                Выбрано строений: {{ modelValue.length }}
            </DashboardChip>
            <Button @click="clean" small danger :disabled="!modelValue.length">Очистить</Button>
            <Button @click="selectAll" small :disabled="modelValue.length === buildings.length">
                Выбрать всё
            </Button>
        </div>
        <div class="building-picker__list">
            <BuildingPickerObject
                v-for="building in buildings"
                :key="building.id"
                @toggle="toggleSelect(building.id)"
                :building="building"
                :selected="cache[building.id]"
                :disabled="disabled"
            />
        </div>
    </div>
</template>
<script setup>
import BuildingPickerObject from '@/components/common/Forms/BuildingPicker/BuildingPickerObject.vue';
import { computed, onBeforeMount } from 'vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import Button from '@/components/common/Button.vue';

const modelValue = defineModel({ type: Array, required: true });
const props = defineProps({
    disabled: {
        type: Boolean,
        default: false
    },
    buildings: {
        type: Array,
        default: () => []
    }
});

const cache = computed(() => {
    return modelValue.value.reduce((acc, element) => {
        acc[element] = true;
        return acc;
    }, {});
});

const toggleSelect = buildingID => {
    if (cache.value[buildingID]) {
        const index = modelValue.value.findIndex(element => Number(element) === buildingID);
        if (index !== -1) modelValue.value.splice(index, 1);
    } else {
        modelValue.value.push(buildingID);
    }
};

const selectAll = () => {
    modelValue.value = props.buildings.map(element => element.id);
};

const clean = () => {
    modelValue.value = [];
};

onBeforeMount(() => {
    if (!modelValue.value) modelValue.value = [];
});
</script>
