<template>
    <div class="ObjectHoldingsParameters">
        <teleport to="body">
            <FormComplexCrane
                v-if="craneFormIsVisible"
                @close="toggleCraneFormIsVisible()"
                :crane="forms.crane"
            />
            <FormComplexElevator
                v-if="elevatorFormIsVisible"
                @close="toggleElevatorFormIsVisible()"
                :elevator="forms.elevator"
            />
            <FormComplexFloor
                v-if="floorFormIsVisible"
                @close="toggleFloorFormVisible()"
                :floor="forms.floor"
                :object="object"
            />
        </teleport>
        <div class="ObjectHoldingsParameters-wrapper">
            <div class="ObjectHoldingsParameters-main">
                <p class="ObjectHoldingsParameters-main-area">
                    <with-unit-type
                        v-if="object.area_building !== null || object.area_field_full !== null"
                        :unit-type="unitTypes.SQUARE_METERS"
                    >
                        {{ formattedArea }}
                    </with-unit-type>
                    <span v-else>не заполнено</span>
                    <template v-if="!object.is_land">
                        (по этажам:
                        <with-unit-type
                            v-if="object.area_floor_full !== null"
                            :unit-type="unitTypes.SQUARE_METERS"
                        >
                            {{ formattedFloorArea }}
                        </with-unit-type>
                        <span v-else>не заполнено</span>
                        )
                    </template>
                </p>
                <p class="ObjectHoldingsParameters-main-address">
                    {{ object.address || 'Адрес не заполнен' }}
                </p>
            </div>
            <ComplexPurposes
                v-if="object.purposes.length && object.object_type"
                :purposes="object.purposes"
            />
            <ComplexParameters v-if="parameters" :parameters="parameters" />
            <div v-if="hasEquipment || isModerator" class="ObjectHoldingsParameters-equipment">
                <ul class="object-holding__list">
                    <ComplexHoldingParametersCrane
                        v-for="crane in object.cranes"
                        :key="crane.id"
                        @click.stop="toggleCraneFormIsVisible(crane)"
                        :crane="crane"
                    />
                    <ComplexHoldingParametersElevator
                        v-for="elevator in object.elevatorsRecords"
                        :key="elevator.id"
                        @click.stop="toggleElevatorFormIsVisible(elevator)"
                        :elevator="elevator"
                    />
                    <li
                        v-if="isModerator"
                        @click.stop="toggleCraneFormIsVisible()"
                        class="object-equipment object-equipment--form"
                    >
                        <IconCrane class="object-equipment__icon" />
                        <i class="fa-solid fa-plus"></i>
                    </li>
                    <li
                        v-if="isModerator"
                        @click="toggleElevatorFormIsVisible()"
                        class="object-equipment object-equipment--form"
                    >
                        <IconElevator class="object-equipment__icon" />
                        <i class="fa-solid fa-plus"></i>
                    </li>
                </ul>
            </div>
        </div>
        <div v-if="floors.length" class="object-holding-parameters__floors">
            <ul class="object-holding-parameters__floors-list">
                <li
                    v-for="floor in floors"
                    :key="floor.number.id"
                    @click="toggleFloorFormVisible(floor)"
                    class="object-holding-parameters__floor"
                >
                    <span>{{ floor.number.title }}</span>
                    <!--                <i-->
                    <!--                    v-if="floor.danger"-->
                    <!--                    class="fas fa-exclamation-circle text-danger"-->
                    <!--                    title="Внимание"-->
                    <!--                ></i>-->
                </li>
                <li
                    v-if="isModerator"
                    @click="toggleFloorFormVisible()"
                    class="object-holding-parameters__floor object-holding-parameters__floor--empty"
                >
                    <span>Добавить этаж</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { unitTypes } from '@/const/unitTypes';
import WithUnitType from '@/components/common/WithUnitType.vue';
import ComplexParameters from '@/components/Complex/ComplexParameters.vue';
import FormComplexCrane from '@/components/Forms/Complex/FormComplexCrane.vue';
import FormComplexElevator from '@/components/Forms/Complex/FormComplexElevator.vue';
import ComplexHoldingParametersCrane from '@/components/Complex/Holding/ComplexHoldingParametersCrane.vue';
import FormComplexFloor from '@/components/Forms/Complex/FormComplexFloor.vue';
import { reducer } from '@/utils/reducer.js';
import { mapGetters, useStore } from 'vuex';
import ComplexHoldingParametersElevator from '@/components/Complex/Holding/ComplexHoldingParametersElevator.vue';
import IconCrane from '@/components/common/Icons/IconCrane.vue';
import IconElevator from '@/components/common/Icons/IconElevator.vue';
import { mapper } from '@/utils/mapper';
import { entityProperties } from '@/const/properties/properties';
import ComplexPurposes from '@/components/Complex/ComplexPurposes.vue';
import { computed, reactive, shallowRef } from 'vue';
import { toNumberFormat } from '@/utils/formatter.js';

const store = useStore();

const props = defineProps({
    object: {
        type: Object,
        required: true
    }
});

const craneFormIsVisible = shallowRef(false);
const elevatorFormIsVisible = shallowRef(false);
const floorFormIsVisible = shallowRef(false);
const forms = reactive({
    crane: null,
    elevator: null,
    floor: null
});

const formattedArea = computed(() => {
    if (props.object.is_land) return toNumberFormat(props.object.area_field_full);
    else return toNumberFormat(props.object.area_building);
});

const parameters = computed(() => {
    return mapper.propertiesToParametersFormat(props.object, entityProperties.object.parameters);
});
const hasEquipment = computed(() => {
    return (
        (props.object.cranes && props.object.cranes.length) ||
        (props.object.elevators && props.object.elevators.length)
    );
});
const floors = computed(() => props.object.floorsRecords.filter(floor => floor.number));
const isModerator = computed(() => store.getters.isModerator);
const formattedFloorArea = computed(() => {
    return toNumberFormat(
        reducer.sum(floors.value, [
            'area_floor_full',
            'area_mezzanine_full',
            'area_tech_full',
            'area_office_full'
        ])
    );
});

const toggleFloorFormVisible = (floor = null) => {
    forms.floor = floor;
    floorFormIsVisible.value = !floorFormIsVisible.value;
};

const toggleCraneFormIsVisible = (crane = null) => {
    forms.crane = crane;
    craneFormIsVisible.value = !craneFormIsVisible.value;
};
const toggleElevatorFormIsVisible = (elevator = null) => {
    forms.elevator = elevator;
    elevatorFormIsVisible.value = !elevatorFormIsVisible.value;
};
</script>
