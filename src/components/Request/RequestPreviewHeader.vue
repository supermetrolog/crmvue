<template>
    <div class="request-preview__header">
        <UiChip v-if="isPassive" color="danger">
            <span>Пассив</span>
            <i v-tippy="statusTippy" class="fa-regular fa-question-circle" />
        </UiChip>
        <UiChip v-if="request.expressRequest" color="danger">Срочно!</UiChip>
        <UiChip>#{{ request.id }}</UiChip>
        <UiChip color="dark">{{ dealType }}</UiChip>
        <UiChip v-for="element in generalObjectTypes" :key="element.id" color="dark">
            {{ element.label }}
        </UiChip>
        <UiChip v-for="element in objectTypes" :key="element.id">
            {{ element.object.name }}
        </UiChip>
    </div>
</template>
<script setup>
import UiChip from '@/components/common/UI/UiChip.vue';
import { computed } from 'vue';
import { requestOptions } from '@/const/options/request.options.js';
import { PassiveWhyRequest } from '@/const/const.js';
import { dealOptions } from '@/const/options/deal.options.js';
import {
    mapRequestGeneralObjectTypes,
    mapRequestObjectTypes
} from '@/utils/mappers/models/request.js';

const props = defineProps({
    request: {
        type: Object,
        required: true
    }
});

const isPassive = computed(() => {
    return props.request.status === requestOptions.statusStatement.PASSIVE;
});

const statusTippy = computed(() => {
    let text = PassiveWhyRequest[props.request.passive_why].label;
    if (props.request.passive_why_comment) text += ': ' + props.request.passive_why_comment;
    return text;
});

const dealType = computed(() => dealOptions.type[Number(props.request.dealType) + 1]);

// object types

const generalObjectTypes = computed(() =>
    mapRequestGeneralObjectTypes(props.request.objectTypesGeneral)
);

const objectTypes = computed(() => mapRequestObjectTypes(props.request.objectTypes));
</script>
