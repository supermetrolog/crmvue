<template>
    <div class="ObjectHoldingsParameters">
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
                    <template v-if="!object.object_type.includes(3)">
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
            <div v-if="object.purposes" class="ObjectHoldingsParameters-types">
                <template v-if="object.purposes.length > 0 && object.object_type">
                    <strong
                        v-for="purpose of object.purposes"
                        :key="purpose"
                        v-tippy="getObjectTypeName(purpose)"
                        class="object-type-box"
                    >
                        <i :class="getObjectTypeIcon(purpose)"></i>
                    </strong>
                </template>
            </div>
            <div v-if="object" class="ObjectHoldingsParameters-provision">
                <ComplexParameters :object="object" />
            </div>
            <div class="ObjectHoldingsParameters-equipment">
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
                <p class="object-holding__label">Краны</p>
                <ul class="object-holding__list mb-2">
                    <ComplexHoldingParametersCrane
                        v-for="crane in object.cranes"
                        :key="crane.id"
                        @click.stop="toggleCraneFormIsVisible(crane)"
                        :crane="crane"
                    />
                    <li>
                        <button @click.stop="toggleCraneFormIsVisible()" class="object-equipment">
                            <i class="fas fa-plus-circle"></i> Добавить кран
                        </button>
                    </li>
                </ul>
                <p class="object-holding__label">Подъемники</p>
                <ul class="object-holding__list">
                    <li>
                        <button @click="toggleElevatorFormIsVisible()" class="object-equipment">
                            <i class="fas fa-plus-circle"></i> Добавить подъемник
                        </button>
                    </li>
                </ul>
            </div>
        </div>
        <div v-if="object.floorsRecords.length" class="object-holding-parameters__floors">
            <p class="object-holding-parameters__subtitle">Этажи</p>
            <ul class="object-holding-parameters__floors-list">
                <li
                    v-for="floor in object.floorsRecords"
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
                    @click="toggleFloorFormVisible()"
                    class="object-holding-parameters__floor object-holding-parameters__floor--empty"
                >
                    <span>Добавить этаж</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { unitTypes } from '@/const/unitTypes';
import { objectPurposes } from '@/const/types';
import WithUnitType from '@/components/common/WithUnitType.vue';
import ComplexParameters from '@/components/Complex/ComplexParameters.vue';
import FormComplexCrane from '@/components/Forms/Complex/FormComplexCrane.vue';
import FormComplexElevator from '@/components/Forms/Complex/FormComplexElevator.vue';
import ComplexHoldingParametersCrane from '@/components/Complex/Holding/ComplexHoldingParametersCrane.vue';
import FormComplexFloor from '@/components/Forms/Complex/FormComplexFloor.vue';
import { reducer } from '@/utils';

export default {
    name: 'ComplexHoldingParameters',
    components: {
        FormComplexFloor,
        ComplexHoldingParametersCrane,
        FormComplexElevator,
        FormComplexCrane,
        ComplexParameters,
        WithUnitType
    },
    props: {
        object: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            craneFormIsVisible: false,
            elevatorFormIsVisible: false,
            floorFormIsVisible: false,
            forms: {
                crane: null,
                elevator: null,
                floor: null
            },
            unitTypes
        };
    },
    computed: {
        formattedArea() {
            if (this.object.object_type.includes(3)) {
                return this.$formatter.number(this.object.area_field_full);
            } else {
                return this.$formatter.number(this.object.area_building);
            }
        },
        formattedFloorArea() {
            return this.$formatter.number(
                reducer.sum(this.object.floorsRecords, [
                    'area_floor_full',
                    'area_mezzanine_full',
                    'area_tech_full',
                    'area_office_full'
                ])
            );
        }
    },
    methods: {
        toggleFloorFormVisible(floor = null) {
            this.forms.floor = floor;
            this.floorFormIsVisible = !this.floorFormIsVisible;
        },
        toggleCraneFormIsVisible(crane = null) {
            this.forms.crane = crane;
            this.craneFormIsVisible = !this.craneFormIsVisible;
        },
        toggleElevatorFormIsVisible(elevator = null) {
            this.forms.elevator = elevator;
            this.elevatorFormIsVisible = !this.elevatorFormIsVisible;
        },
        getObjectTypeIcon(purpose) {
            return objectPurposes[purpose].icon;
        },
        getObjectTypeName(purpose) {
            return objectPurposes[purpose].name;
        }
    }
};
</script>
