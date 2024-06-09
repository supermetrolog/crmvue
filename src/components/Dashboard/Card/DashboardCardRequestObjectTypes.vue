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
                        v-for="(element, key) in objectTypes.production"
                        :key="key"
                        v-tippy="element.name"
                        class="dashboard-card-view__purpose"
                        :class="
                            element.included
                                ? 'dashboard-bg-success dashboard-cl-white'
                                : 'dashboard-bg-gray-l'
                        "
                    >
                        <i class="icon" :class="element.icon" />
                    </DashboardChip>
                </div>
            </div>
            <div class="col-4">
                <div class="d-flex flex-wrap gap-1">
                    <DashboardChip
                        v-for="(element, key) in objectTypes.warehouse"
                        :key="key"
                        v-tippy="element.name"
                        class="dashboard-card-view__purpose"
                        :class="
                            element.included
                                ? 'dashboard-bg-success dashboard-cl-white'
                                : 'dashboard-bg-gray-l'
                        "
                    >
                        <i class="icon" :class="element.icon" />
                    </DashboardChip>
                </div>
            </div>
            <div class="col-4">
                <div class="d-flex flex-wrap gap-1">
                    <DashboardChip
                        v-for="(element, key) in objectTypes.plot"
                        :key="key"
                        v-tippy="element.name"
                        class="dashboard-card-view__purpose"
                        :class="
                            element.included
                                ? 'dashboard-bg-success dashboard-cl-white'
                                : 'dashboard-bg-gray-l'
                        "
                    >
                        <i class="icon" :class="element.icon" />
                    </DashboardChip>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { entityOptions } from '@/const/options/options.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { cloneObject } from '@/utils/index.js';

export default {
    name: 'DashboardCardRequestObjectTypes',
    components: {
        DashboardChip
    },
    props: {
        request: {
            type: Object,
            required: true
        }
    },
    computed: {
        objectTypesGeneral() {
            const types = cloneObject(entityOptions.object.typeGeneralList);

            this.request.objectTypesGeneral.forEach(
                element => (types[element.type].included = true)
            );

            return types;
        },
        objectTypes() {
            const types = cloneObject(entityOptions.object.purposesWithSections);
            console.log(types);

            this.request.objectTypes.forEach(element => {
                console.log(element.object_type);

                if (element.object_type < 12) {
                    types.warehouse[element.object_type].included = true;
                } else if (element.object_type < 25)
                    types.production[element.object_type - 12].included = true;
                else {
                    types.plot[element.object_type - 25].included = true;
                }
            });

            return types;
        }
    }
};
</script>
