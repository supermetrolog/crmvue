<template>
    <div class="request-preview__box request-preview__requirements">
        <div class="mb-3">
            <p class="request-preview__subtitle mb-1">Основные требования</p>
            <div class="request-preview__grid">
                <RequestPreviewRequirementsRow icon="fa-solid fa-star">
                    {{ objectClasses }}
                </RequestPreviewRequirementsRow>
                <RequestPreviewRequirementsRow
                    v-if="request.firstFloorOnly"
                    icon="fa-solid fa-stairs"
                >
                    Только 1 этаж
                </RequestPreviewRequirementsRow>
                <RequestPreviewRequirementsRow
                    v-if="request.minCeilingHeight || request.maxCeilingHeight"
                    icon="fa-solid fa-arrows-up-down"
                >
                    {{ ceilingHeight }}
                </RequestPreviewRequirementsRow>
                <RequestPreviewRequirementsRow
                    v-if="request.antiDustOnly"
                    icon="fa-solid fa-square-virus"
                >
                    Антипыль
                </RequestPreviewRequirementsRow>
                <RequestPreviewRequirementsRow v-if="false" icon="fa-solid fa-door-open">
                </RequestPreviewRequirementsRow>
                <RequestPreviewRequirementsRow
                    v-if="request.gateTypes.length"
                    icon="fa-solid fa-door-open"
                >
                    {{ gateTypes }}
                </RequestPreviewRequirementsRow>
            </div>
        </div>
        <div>
            <p class="request-preview__subtitle mb-1">Коммуникации</p>
            <div class="request-preview__grid">
                <RequestPreviewRequirementsRow
                    v-if="hasHeatingOption"
                    icon="fa-solid fa-temperature-low"
                >
                    {{ request.heated === 1 ? 'Отапливаемый' : 'Холодный' }}
                </RequestPreviewRequirementsRow>
                <RequestPreviewRequirementsRow v-if="request.electricity" icon="fa-solid fa-bolt">
                    От {{ toNumberFormat(request.electricity) }} кВт
                </RequestPreviewRequirementsRow>
                <RequestPreviewRequirementsRow v-if="request.gaz" icon="fa-solid fa-gas-pump">
                    Газ
                </RequestPreviewRequirementsRow>
                <RequestPreviewRequirementsRow
                    v-if="request.sewerage"
                    icon="fa-solid fa-faucet-drip"
                >
                    Канализация
                </RequestPreviewRequirementsRow>
                <RequestPreviewRequirementsRow v-if="request.water" icon="fa-solid fa-droplet">
                    Вода
                </RequestPreviewRequirementsRow>
                <RequestPreviewRequirementsRow v-if="request.steam" icon="fa-solid fa-cloud">
                    Пар
                </RequestPreviewRequirementsRow>
                <RequestPreviewRequirementsRow v-if="request.trainLine" icon="fa-solid fa-train">
                    <span>Ж/Д ветка</span>
                    <span v-if="request.trainlineLength">, {{ request.trainLineLength }} м</span>
                </RequestPreviewRequirementsRow>
                <RequestPreviewRequirementsRow
                    v-if="request.haveCranes"
                    icon="fa-solid fa-arrows-up-to-line"
                >
                    Краны
                </RequestPreviewRequirementsRow>
                <RequestPreviewRequirementsRow
                    v-if="request.shelving"
                    icon="fa-solid fa-box-archive"
                >
                    Стеллажи
                </RequestPreviewRequirementsRow>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { toNumberFormat } from '@/utils/formatters/number.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { GateTypeList } from '@/const/const.js';
import RequestPreviewRequirementsRow from '@/components/Request/RequestPreviewRequirementsRow.vue';
import { objectOptions } from '@/const/options/object.options.js';

const props = defineProps({
    request: {
        type: Object,
        required: true
    }
});

const objectClasses = computed(() => {
    return props.request.objectClasses
        .map(objectClass => objectOptions.class[objectClass.object_class + 1])
        .join(', ');
});

const hasHeatingOption = computed(() => isNotNullish(props.request.heated));

const ceilingHeight = computed(() => {
    const min = props.request.minCeilingHeight;
    const max = props.request.maxCeilingHeight;

    if (min === max) {
        return `${min} м`;
    }

    if (min && max) {
        return `От ${min} до ${max} м`;
    }

    if (min) {
        return `От ${min} м`;
    }

    return `До ${max} м`;
});

const gateTypes = computed(() => {
    return props.request.gateTypes.map(({ gate_type }) => GateTypeList[gate_type]).join(', ');
});
</script>
