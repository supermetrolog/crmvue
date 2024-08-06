<template>
    <div class="deal-floor">
        <div class="deal-floor__top">
            <p class="deal-floor__label" :title="name">{{ name }}</p>
            <with-unit-type class="deal-floor__label" :unit-type="unitTypes.SQUARE_METERS">
                {{ formattedArea }}
            </with-unit-type>
        </div>
        <div class="deal-floor__bottom">
            <HoverActionsButton
                @click="$emit('openEditForm')"
                class="deal-floor__button"
                label="Редактировать этаж"
                small
            >
                <i class="fa-solid fa-pen" />
            </HoverActionsButton>
            <HoverActionsButton
                @click="$emit('openForm')"
                class="deal-floor__button"
                label="Добавить блок"
                small
            >
                <i class="fa-solid fa-plus"></i>
            </HoverActionsButton>
        </div>
    </div>
</template>

<script setup>
import { unitTypes } from '@/const/unitTypes';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { computed } from 'vue';
import { toNumberFormat } from '@/utils/formatter.js';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';

defineEmits(['openForm', 'openEditForm']);

const props = defineProps({
    number: {
        id: Number,
        title: String,
        description: String,
        sign: Number,
        color: String,
        order_row: Number
    },
    area: {
        type: Number,
        default: null
    },
    checked: {
        type: Boolean
    }
});

// const isChecked = shallowRef(props.checked);

// const headInputId = computed(() => 'floor-check_' + props.number.title);
const formattedArea = computed(() => toNumberFormat(props.area));
const name = computed(() => (props.number ? props.number.title : 'Нет названия'));
</script>
