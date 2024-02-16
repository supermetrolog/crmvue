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
            <div
                v-if="object.purposes.length && object.object_type"
                class="ObjectHoldingsParameters-types"
            >
                <strong
                    v-for="purpose of object.purposes"
                    :key="purpose"
                    v-tippy="getObjectTypeName(purpose)"
                    class="object-type-box"
                >
                    <i :class="getObjectTypeIcon(purpose)"></i>
                </strong>
            </div>
            <div v-if="parameters" class="ObjectHoldingsParameters-provision">
                <ComplexParameters :parameters="parameters" />
            </div>
            <div v-if="hasEquipment" class="ObjectHoldingsParameters-equipment">
                <div>
                    <ul class="object-holding__list mb-2">
                        <ComplexHoldingParametersCrane
                            v-for="crane in object.cranes"
                            :key="crane.id"
                            @click.stop="toggleCraneFormIsVisible(crane)"
                            :crane="crane"
                        />
                        <ComplexHoldingParametersElevator
                            v-for="elevator in object.elevators"
                            :key="elevator.id"
                            @click.stop="toggleElevatorFormIsVisible(elevator)"
                            :elevator="elevator"
                        />
                        <li
                            v-if="isModerator"
                            @click.stop="toggleCraneFormIsVisible()"
                            class="object-equipment object-equipment--form"
                        >
                            <teleport to="body">
                                <FormComplexCrane
                                    v-if="craneFormIsVisible"
                                    @close="toggleCraneFormIsVisible()"
                                    :crane="forms.crane"
                                />
                            </teleport>
                            <IconCrane class="object-equipment__icon" />
                            <i class="fa-solid fa-plus"></i>
                        </li>
                        <li
                            v-if="isModerator"
                            @click="toggleElevatorFormIsVisible()"
                            class="object-equipment object-equipment--form"
                        >
                            <teleport to="body">
                                <FormComplexElevator
                                    v-if="elevatorFormIsVisible"
                                    @close="toggleElevatorFormIsVisible()"
                                    :elevator="forms.elevator"
                                />
                            </teleport>
                            <IconElevator class="object-equipment__icon" />
                            <i class="fa-solid fa-plus"></i>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div v-if="object.floorsRecords.length" class="object-holding-parameters__floors">
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
                    v-if="isModerator"
                    @click="toggleFloorFormVisible()"
                    class="object-holding-parameters__floor object-holding-parameters__floor--empty"
                >
                    <FormComplexFloor
                        v-if="floorFormIsVisible"
                        @close="toggleFloorFormVisible()"
                        :floor="forms.floor"
                        :object="object"
                    />
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
import { mapGetters } from 'vuex';
import ComplexHoldingParametersElevator from '@/components/Complex/Holding/ComplexHoldingParametersElevator.vue';
import IconCrane from '@/components/common/Icons/IconCrane.vue';
import IconElevator from '@/components/common/Icons/IconElevator.vue';
import { objectParameters } from '@/const/properties';
import { alg } from '@/utils/alg';

export default {
    name: 'ComplexHoldingParameters',
    components: {
        IconElevator,
        IconCrane,
        ComplexHoldingParametersElevator,
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
        },
        parameters() {
            const counts = Object.keys(objectParameters.count).map(key => ({
                value: this.object[key],
                ...objectParameters.count[key]
            }));

            const types = Object.keys(objectParameters.types).map(key => {
                const currentParameter = objectParameters.types[key];

                const objValues = {
                    value: this.object[key]
                };

                if (currentParameter.countProperty)
                    objValues.valueCount = this.object[currentParameter.countProperty];

                return {
                    ...objValues,
                    ...currentParameter
                };
            });

            return {
                count: alg.deleteObjectsWithUndueProperties(counts, 'value'),
                type: alg.deleteObjectsWithUndueProperties(types, 'value', 0)
            };
        },
        hasEquipment() {
            return (
                (this.object.cranes && this.object.cranes.length) ||
                (this.object.elevators && this.object.elevators.length)
            );
        },
        ...mapGetters({ isModerator: 'isModerator' })
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
