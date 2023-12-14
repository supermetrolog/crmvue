<template>
    <div class="additional-details">
        <h2 class="additonal-deatils__heading">{{ taxForm }}</h2>
        <ul v-if="extraCosts" class="additional-details__list">
            <li class="additional-details__item additional-details__item_heading">
                Дополнительные расходы
            </li>
            <li
                class="additional-details__item"
                v-for="(item, idx) in extraCosts"
                :key="item.label + idx"
            >
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
            <li class="additional-details__item additional-details__item_heading">
                Особые условия
            </li>
            <li
                class="additional-details__item"
                v-for="(item, idx) in specialTerms"
                :key="item.label + idx"
            >
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
        <ul
            v-if="business"
            class="additional-details__list additional-deatils__list_business"
        >
            <li
                class="additional-details__item additional-details__item_heading additional-details__item_color_red"
            >
                <i class="fa fa-briefcase" aria-hidden="true"></i>
                {{ ucFirstCharBusinessType }}
                бизнес
            </li>
            <li
                class="additional-details__item"
                v-for="(item, idx) in business.info"
                :key="item.label + idx"
            >
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
import WithUnitType from "@/components/common/with-unit-type/WithUnitType.vue";
import {TaxFormList} from "@/const/Const";
import {unitTypes} from "@/const/unitTypes";

export default {
    name: "AdditionalDetails",
    components: {WithUnitType},
    props: {
        label: {
            type: [Number, String],
            default: "не задано",
        },
        exploitation: {
            type: Boolean,
        },
        communal: {
            type: Boolean,
        },
        extraCosts: {
            type: Array,
        },
        specialTerms: {
            type: Array,
        },
        business: {
            type: Object,
        },
    },
    data() {
        return {
            ucFirstTextFormatter: this.$formatter.text(),
            TaxFormList,
        };
    },
    computed: {
        taxForm() {
            return TaxFormList.find((item) => item.value === this.label).label;
        },
        ucFirstCharBusinessType() {
            return this.ucFirstTextFormatter.ucFirst(this.business.type);
        },
    },
    methods: {
        addDotsToLabel(value, maxLen) {
            let res = value;
            while (res.length < maxLen) {
                res += ".";
            }

            return res;
        },
        formatValue(item) {
            if (item.unitType === unitTypes.YEAR) {
                return item.value;
            }
            return this.$formatter.numberOrRangeNew(item.valueMin, item.valueMax);
        },
    },
};
</script>

<style
    src="../../../../../oldsrc/components/complex/object-holdings/deal-info/deal-detailed-info/additional-detailes/AdditionalDetails.scss"
    lang="scss"></style>
