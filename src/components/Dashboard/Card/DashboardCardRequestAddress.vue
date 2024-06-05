<template>
    <div>
        <div class="mb-2">
            <p class="mb-1">Регионы</p>
            <div v-if="request.regions?.length" class="d-flex gap-1 flex-wrap">
                <DashboardChip
                    v-for="region in request.regions"
                    :key="region.id"
                    class="dashboard-bg-light"
                >
                    {{ $formatter.text().ucFirst(region.info.title) }}
                </DashboardChip>
            </div>
            <p v-else>Не указано</p>
        </div>
        <div v-if="request.directions?.length" class="mb-2">
            <p class="mb-1">Московская область</p>
            <div class="d-flex gap-1 flex-wrap">
                <DashboardChip
                    v-for="(direction, key) in directions"
                    :key="key"
                    class="dashboard-bg-light"
                >
                    {{ direction }}
                </DashboardChip>
            </div>
        </div>
        <div v-if="request.districts?.length" class="mb-2">
            <p class="mb-1">Москва</p>
            <div class="d-flex gap-1 flex-wrap">
                <DashboardChip
                    v-for="(district, key) in districts"
                    :key="key"
                    class="dashboard-bg-light"
                >
                    {{ district }}
                </DashboardChip>
            </div>
        </div>
        <p v-if="!request.distanceFromMKADnotApplicable">
            До {{ request.distanceFromMKAD }} км от МКАД
        </p>
    </div>
</template>

<script>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { entityOptions } from '@/const/options/options.js';

export default {
    name: 'DashboardCardRequestAddress',
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
        directions() {
            return this.request.directions.map(
                element => entityOptions.location.directionWithShort[element.direction].full
            );
        },
        districts() {
            return this.request.districts.map(
                element => entityOptions.location.district[element.district]
            );
        }
    }
};
</script>
