<template>
    <div class="messenger-quiz-question-template-offer__content">
        <div class="messenger-quiz-question-template-offer__description">
            <h4 v-if="offer.company" class="messenger-quiz-question-template-offer__company">
                {{ companyName }}
            </h4>
            <p class="messenger-quiz-question-template-offer__address">
                <i class="fa-solid fa-earth-americas mr-1"></i>
                <span>{{ offer.object.address }}</span>
                <span v-if="offer.from_mkad">; {{ offer.from_mkad }} км от мкад </span>
            </p>
        </div>
        <div class="d-flex gap-1 flex-wrap">
            <DashboardChip class="dashboard-bg-success-l">
                {{ dealType }}
            </DashboardChip>
            <DashboardChip
                v-if="offer.hide_from_market"
                v-tippy="'Не выгружается'"
                class="dashboard-bg-warning-l"
            >
                <i class="fa-solid fa-eye-slash"></i>
            </DashboardChip>
            <DashboardChip v-tippy="'Класс объекта'" class="dashboard-bg-gray-l">
                {{ offer.class_name }}
            </DashboardChip>
            <DashboardChip
                v-if="offer.object"
                v-tippy="'Общая площадь объекта'"
                class="dashboard-bg-gray-l"
                with-icon
            >
                <i class="fa-solid fa-expand"></i>
                <WithUnitType :unit-type="unitTypes.SQUARE_METERS">
                    {{ fullArea }}
                </WithUnitType>
            </DashboardChip>
            <DashboardChip v-if="offer.offer?.is_exclusive" class="dashboard-bg-gray-l">
                Эксклюзив
            </DashboardChip>
            <DashboardChip v-if="offer.offer?.built_to_suit === 1" class="dashboard-bg-gray-l">
                Инвестпроект
            </DashboardChip>
            <DashboardChip v-if="offer.test_only" class="dashboard-bg-gray-l">
                Тестовый
            </DashboardChip>
            <DashboardChip v-if="offer.is_fake" class="dashboard-bg-gray-l"> Фейк </DashboardChip>
        </div>
    </div>
</template>
<script setup>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { computed } from 'vue';
import { dealOptions } from '@/const/options/deal.options.js';
import { toNumberFormat } from '@/utils/formatters/number.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { getCompanyName } from '@/utils/formatters/models/company.js';

const props = defineProps({
    offer: {
        type: Object,
        required: true
    }
});

// computes

const dealType = computed(() => dealOptions.type[props.offer.deal_type]);

// company

const companyName = computed(() => getCompanyName(props.offer.company, props.offer.company_id));

const fullArea = computed(() => {
    if (props.offer.object.is_land) return toNumberFormat(props.offer.object.area_field_full);
    return toNumberFormat(props.offer.object.area_building);
});
</script>
