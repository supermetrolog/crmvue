<template>
    <div class="deal-floor">
        <div class="deal-floor__top">
            <p class="deal-floor__label" :title="name">{{ name }}</p>
            <with-unit-type class="deal-floor__label" :unit-type="unitTypes.SQUARE_METERS">
                {{ $formatter.number(area) }}
            </with-unit-type>
        </div>
        <div class="deal-floor__bottom">
            <button
                v-tippy="'Редактировать этаж'"
                @click="$emit('openEditForm')"
                class="deal-floor__button"
            >
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button v-tippy="'Добавить блок'" @click="$emit('openForm')" class="deal-floor__button">
                <i class="fa-solid fa-circle-plus"></i>
            </button>
        </div>
    </div>
</template>

<script>
import { unitTypes } from '@/const/unitTypes';
import WithUnitType from '@/components/common/WithUnitType.vue';

export default {
    name: 'ComplexDealFloorHead',
    components: {
        WithUnitType
    },
    props: {
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
    },
    data() {
        return {
            unitTypes,
            isChecked: this.checked
        };
    },
    computed: {
        formattedArea() {
            return this.$formatter.number(this.area);
        },
        headInputId() {
            return 'floor-check_' + this.number.title;
        },
        name() {
            return this.number ? this.number.title : 'Нет названия';
        }
    },
    methods: {}
};
</script>
