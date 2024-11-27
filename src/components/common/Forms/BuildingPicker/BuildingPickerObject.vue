<template>
    <div
        @click.prevent="toggle"
        class="building-picker-object"
        :class="{ disabled: disabled, selected: selected }"
    >
        <div class="building-picker-object__preview">
            <DashboardChip class="building-picker-object__id dashboard-bg-primary">
                ID-{{ building.id }}
            </DashboardChip>
            <VLazyImage
                class="building-picker-object__image"
                :src="building.thumb"
                alt="image preview"
            />
        </div>
        <div class="building-picker-object__content">
            <DashboardChip class="dashboard-bg-primary-l mb-1">
                <WithUnitType :unit-type="unitTypes.SQUARE_METERS">
                    {{ area }}
                </WithUnitType>
            </DashboardChip>
            <p class="building-picker-object__description">
                {{ building.description ?? '-' }}
            </p>
        </div>
    </div>
</template>
<script setup>
import VLazyImage from 'v-lazy-image';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { computed } from 'vue';
import { toNumberFormat } from '@/utils/formatters/number.js';

const emit = defineEmits(['toggle']);
const props = defineProps({
    building: {
        type: Array,
        default: () => []
    },
    disabled: {
        type: Boolean,
        default: false
    },
    selected: {
        type: Boolean,
        default: false
    }
});

const area = computed(() => toNumberFormat(props.building.area_building));

const toggle = () => {
    if (!props.disabled) emit('toggle');
};
</script>
