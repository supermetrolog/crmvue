<template>
    <div class="additional-details">
        <h2 class="additonal-deatils__heading">{{ taxForm }}</h2>
        <ul v-if="extraCosts" class="additional-details__list">
            <li class="additional-details__item additional-details__item_heading">Дополнительные расходы</li>
            <li v-for="(item, idx) in extraCosts" :key="item.label + idx" class="additional-details__item">
                <p class="additional-details__item-label">
                    {{ addDotsToLabel(item.label, 100) }}
                </p>
                <with-unit-type
                    class="additional-details__item-value"
                    :value="formatValue(item)"
                    :unitType="item.unitType"
                />
            </li>
        </ul>
        <ul v-if="specialTerms" class="additional-details__list">
            <li class="additional-details__item additional-details__item_heading">Особые условия</li>
            <li v-for="(item, idx) in specialTerms" :key="item.label + idx" class="additional-details__item">
                <p class="additional-details__item-label">
                    {{ addDotsToLabel(item.label, 100) }}
                </p>
                <with-unit-type
                    class="additional-details__item-value"
                    :value="formatValue(item)"
                    :unitType="item.unitType"
                />
            </li>
        </ul>
        <ul v-if="business" class="additional-details__list additional-deatils__list_business">
            <li class="additional-details__item additional-details__item_heading additional-details__item_color_red">
                <i class="fa fa-briefcase" aria-hidden="true"></i>
                {{ ucFirstCharBusinessType }}
                бизнес
            </li>
            <li v-for="(item, idx) in business.info" :key="item.label + idx" class="additional-details__item">
                <p class="additional-details__item-label">
                    {{ addDotsToLabel(item.label, 100) }}
                </p>
                <with-unit-type
                    class="additional-details__item-value"
                    :value="formatValue(item)"
                    :unitType="item.unitType"
                />
            </li>
        </ul>
    </div>
</template>

<script>
import { TaxFormList } from '@/const/const.js';
import { unitTypes } from '@/const/unitTypes.js';
import WithUnitType from '@/components/common/WithUnitType.vue';

export default {
    name: 'ComplexDealDetails',
    components: { WithUnitType },
    props: {
        label: {
            type: [Number, String],
            default: 'не задано'
        },
        exploitation: {
            type: Boolean
        },
        communal: {
            type: Boolean
        },
        extraCosts: {
            type: Array
        },
        specialTerms: {
            type: Array
        },
        business: {
            type: Object
        }
    },
    data() {
        return {
            ucFirstTextFormatter: this.$formatter.text()
        };
    },
    computed: {
        taxForm() {
            return TaxFormList.find(item => item.value === this.label).label;
        },
        ucFirstCharBusinessType() {
            return this.ucFirstTextFormatter.ucFirst(this.business.type);
        }
    },
    methods: {
        addDotsToLabel(value, maxLen) {
            let res = value;
            while (res.length < maxLen) {
                res += '.';
            }

            return res;
        },
        formatValue(item) {
            if (item.unitType === unitTypes.YEAR) {
                return item.value;
            }
            return this.$formatter.numberOrRangeNew(item.valueMin, item.valueMax);
        }
    }
};
</script>