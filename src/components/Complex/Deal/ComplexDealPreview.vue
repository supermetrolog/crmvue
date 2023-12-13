<template>
    <div
        class="DealPreviewCard"
        :class="{ active: isCurrent }"
        @click="onChooseDeal"
    >
        <button v-if="isCurrent" class="DealPreviewCard-edit">
            <i class="fas fa-pen"></i>
        </button>
        <span class="DealPreviewCard-type">{{ dealType }}</span>
        <p class="DealPreviewCard-company">{{ deal.company.name || "--" }}</p>
        <p class="DealPreviewCard-area">
            {{ dealArea }}
            <span v-if="deal.area" class="DealPreviewCard-price-unit"
            >м<sup>2</sup></span
            >
        </p>
        <p class="DealPreviewCard-price">
            <with-unit-type :unit-type="deal.price.unitType">{{ dealPrice }}</with-unit-type>
        </p>
        <p
            class="DealPreviewCard-status"
            :class="{
        success: deal.status === DealStatusType.FOR_RENT,
        danger:
          deal.status === DealStatusType.RENTED_OUT ||
          deal.status === DealStatusType.SOLD_OUT,
      }"
        >
            {{ dealStatus }}
        </p>
        <div class="DealPreviewCard-triangle"></div>
    </div>
</template>

<script>
import {DealStatusType, DealTypeList} from "@/const/const";
import {unitTypes} from "@/const/unitTypes";
import WithUnitType from "@/components/common/WithUnitType.vue";

export default {
    name: "ComplexDealPreview",
    components: {
        WithUnitType
    },
    props: {
        deal: {
            type: Object,
            required: true,
        },
        isCurrent: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            dealTypeList: DealTypeList.get("param"),
            DealStatusType,
            unitTypes,
        };
    },
    computed: {
        dealType() {
            return this.deal.type ? this.dealTypeList[this.deal.type].label : null;
        },

        dealStatus() {
            switch (this.deal.status) {
                case 1:
                    return "Сдается";
                case 2:
                    return "Сдано";
                case 3:
                    return "Продано";
                default:
                    return "Неизвестно";
            }
        },
        dealArea() {
            const {valueMin, valueMax} = this.deal.area;
            if (valueMin && valueMax)
                return this.$formatter.numberOrRangeNew(valueMin, valueMax);
            return "--";
        },
        dealPrice() {
            const {valueMin, valueMax} = this.deal.price;
            if (valueMin && valueMax)
                return this.$formatter.numberOrRangeNew(valueMin, valueMax);
            return "нет данных";
        },
        typePresence() {
            return this.deal.price.type && this.deal.price.valueMin;
        },
    },
    methods: {
        onChooseDeal() {
            this.$emit("choose", this.deal.id);
        },
        onClickEdit() {
            this.$emit("edit");
        },
    },
    emits: ["choose", "edit"],
};
</script>
