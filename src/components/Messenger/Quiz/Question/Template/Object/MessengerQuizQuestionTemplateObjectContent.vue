<template>
    <div class="messenger-quiz-question-template-offer__content">
        <div class="messenger-quiz-question-template-offer__description">
            <p class="messenger-quiz-question-template-offer__address">
                <i class="fa-solid fa-earth-americas mr-1"></i>
                <span>{{ object.address }}</span>
            </p>
            <p v-if="object.from_mkad">{{ object.from_mkad }} км от мкад</p>
        </div>
        <div class="d-flex gap-1 flex-wrap">
            <DashboardChip v-tippy="'Класс объекта'" class="dashboard-bg-gray-l">
                {{ object.object_class_text }}
            </DashboardChip>
            <DashboardChip v-tippy="'Общая площадь объекта'" class="dashboard-bg-gray-l" with-icon>
                <i class="fa-solid fa-expand"></i>
                <WithUnitType :unit-type="unitTypes.SQUARE_METERS">
                    {{ fullArea }}
                </WithUnitType>
            </DashboardChip>
            <DashboardChip v-if="object.test_only" class="dashboard-bg-gray-l">
                Тестовый
            </DashboardChip>
        </div>
    </div>
</template>
<script setup>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { computed } from 'vue';
import { toNumberFormat } from '@/utils/formatters/number.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';

const props = defineProps({
    object: {
        type: Object,
        required: true
    }
});

const fullArea = computed(() => {
    if (props.object.is_land) return toNumberFormat(props.object.area_field_full);
    return toNumberFormat(props.object.area_building);
});
</script>
