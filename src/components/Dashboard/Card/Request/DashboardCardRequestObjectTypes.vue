<template>
    <div>
        <div class="row mb-2">
            <div v-for="(element, key) in objectTypesGeneral" :key="key" class="col-4">
                <DashboardChip
                    class="w-100 text-center"
                    :class="
                        element.included
                            ? 'dashboard-bg-success dashboard-cl-white'
                            : 'dashboard-bg-gray-l'
                    "
                >
                    {{ element.name }}
                </DashboardChip>
            </div>
        </div>
        <div class="row">
            <div class="col-4">
                <div class="d-flex flex-wrap gap-1">
                    <DashboardChip
                        v-for="element in objectTypes.warehouse"
                        :key="element.id"
                        v-tippy="element.value.name"
                        class="dashboard-card-view__purpose"
                        :class="
                            element.included
                                ? 'dashboard-bg-success dashboard-cl-white'
                                : 'dashboard-bg-gray-l'
                        "
                    >
                        <i class="icon" :class="element.value.icon" />
                    </DashboardChip>
                </div>
            </div>
            <div class="col-4">
                <div class="d-flex flex-wrap gap-1">
                    <DashboardChip
                        v-for="element in objectTypes.production"
                        :key="element.id"
                        v-tippy="element.value.name"
                        class="dashboard-card-view__purpose"
                        :class="
                            element.included
                                ? 'dashboard-bg-success dashboard-cl-white'
                                : 'dashboard-bg-gray-l'
                        "
                    >
                        <i class="icon" :class="element.value.icon" />
                    </DashboardChip>
                </div>
            </div>
            <div class="col-4">
                <div class="d-flex flex-wrap gap-1">
                    <DashboardChip
                        v-for="element in objectTypes.plot"
                        :key="element.id"
                        v-tippy="element.value.name"
                        class="dashboard-card-view__purpose"
                        :class="
                            element.included
                                ? 'dashboard-bg-success dashboard-cl-white'
                                : 'dashboard-bg-gray-l'
                        "
                    >
                        <i class="icon" :class="element.value.icon" />
                    </DashboardChip>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { entityOptions } from '@/const/options/options.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { cloneObject } from '@/utils/helpers/object/cloneObject.js';
import { computed } from 'vue';

const props = defineProps({
    request: {
        type: Object,
        required: true
    }
});

const objectTypesGeneral = computed(() => {
    const types = cloneObject(entityOptions.object.typeGeneralList);

    for (const element of props.request.objectTypesGeneral) {
        if (element.type < 3 && element.type >= 0) types[element.type].included = true;
    }

    return types;
});

const objectTypes = computed(() => {
    const _objectTypes = props.request.objectTypes.reduce((acc, element) => {
        acc[element.object_type] = true;
        return acc;
    }, {});

    return {
        warehouse: Object.entries(entityOptions.object.purposesWithSections.warehouse).map(
            ([key, value]) => {
                return { id: key, included: Boolean(_objectTypes[key]), value };
            }
        ),
        production: Object.entries(entityOptions.object.purposesWithSections.production).map(
            ([key, value]) => {
                return { id: key, included: Boolean(_objectTypes[key]), value };
            }
        ),
        plot: Object.entries(entityOptions.object.purposesWithSections.plot).map(([key, value]) => {
            return { id: key, included: Boolean(_objectTypes[key]), value };
        })
    };
});
</script>
