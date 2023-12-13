<template>
    <div class="DealFloorHead">
        <div class="DealFloorHead-top">
            <p class="DealFloorHead-text DealFloorHead-text_label">
                {{ name }}
            </p>
            <with-unit-type
                :unitType="unitTypes.SQUARE_METERS"
                class="DealFloorHead-text DealFloorHead-text_area"
            >
                {{ formattedArea }}
            </with-unit-type>
        </div>
        <div class="DealFloorHead-bottom">
            <Form class="edit">
                <input
                    class="DealFloorHead-checkbox"
                    type="checkbox"
                    name=""
                    v-model="isChecked"
                    :checked="isChecked"
                    :id="headInputId"
                />
                <label class="DealFloorHead-checkbox-label" :for="headInputId"/>
                <button class="DealFloorHead-button" @click="$emit('openForm')"><i class="fas fa-plus-circle"></i>
                </button>
            </Form>
        </div>
    </div>
</template>

<script>
import {unitTypes} from "@/const/unitTypes";
import Form from "@/components/forms/Form.vue";
import WithUnitType from "@/components/common/WithUnitType.vue";

export default {
    name: "ComplexDealFloorHead",
    components: {
        WithUnitType,
        Form,
    },
    props: {
        name: {
            type: String,
        },
        area: {
            type: Object,
        },
        checked: {
            type: Boolean,
        },
    },
    data() {
        return {
            unitTypes,
            isChecked: this.checked,
        };
    },
    methods: {},
    computed: {
        formattedArea() {
            return this.$formatter.numberOrRangeNew(
                this.area.valueMin,
                this.area.valueMax
            );
        },
        headInputId() {
            return "floor-check_" + this.name;
        },
    },
};
</script>