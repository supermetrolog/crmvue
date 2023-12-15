<template>
    <div class="ObjectHoldingsParameters">
        <div class="ObjectHoldingsParameters-wrapper">
            <div class="ObjectHoldingsParameters-main">
                <p class="ObjectHoldingsParameters-main-area">
                    <with-unit-type
                        v-if="object.area_building !== null || object.area_field_full !== null"
                        :unitType="unitTypes.SQUARE_METERS"
                    >
                        {{ formattedArea }}
                    </with-unit-type>
                    <span v-else>не заполнено</span>
                    <template v-if="!object.object_type.includes(3)">
                        (по этажам:
                        <with-unit-type v-if="object.area_floor_full !== null" :unitType="unitTypes.SQUARE_METERS">
                            {{ formattedFloorArea }}
                        </with-unit-type>
                        <span v-else>не заполнено</span>
                        )
                    </template>
                </p>
                <p class="ObjectHoldingsParameters-main-address">{{ object.address || 'Адрес не заполнен' }}</p>
            </div>
            <div v-if="object.purposes" class="ObjectHoldingsParameters-types">
                <template v-if="object.purposes.length > 0 && object.object_type">
                    <strong
                        v-for="purpose of object.purposes"
                        :key="purpose"
                        class="object-type-box"
                        :title="getObjectTypeName(purpose)"
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
                    <transition
                        mode="out-in"
                        enter-active-class="animate__animated animate__zoomIn for__modal absolute"
                        leave-active-class="animate__animated animate__zoomOut for__modal absolute"
                    >
                        <FormComplexCrane v-if="addCraneFormIsVisible" @close="toggleAddCraneFormIsVisible" />
                    </transition>
                </teleport>
                <teleport to="body">
                    <transition
                        mode="out-in"
                        enter-active-class="animate__animated animate__zoomIn for__modal absolute"
                        leave-active-class="animate__animated animate__zoomOut for__modal absolute"
                    >
                        <FormComplexElevator v-if="addElevatorFormIsVisible" @close="toggleAddElevatorFormIsVisible" />
                    </transition>
                </teleport>
                <p class="ObjectHoldingsParameters-equipment-label">Краны</p>
                <ul class="ObjectHoldingsParameters-equipment-list">
                    <li v-for="crane in object.cranes" :key="crane.id" class="ObjectHoldingsParameters-equipment-item">
                        <span v-if="crane.crane_type" class="ObjectHoldingsParameters-equipment-text">{{
                            crane.type.title
                        }}</span>
                        <span v-if="crane.crane_capacity" class="ObjectHoldingsParameters-equipment-text">
                            / {{ crane.crane_capacity }} тонн</span
                        >
                        <span v-if="crane.crane_location" class="ObjectHoldingsParameters-equipment-text">
                            /
                            {{ crane.location.title }}
                        </span>
                        <span v-if="crane.crane_hook_height" class="ObjectHoldingsParameters-equipment-text">
                            / до крюка {{ crane.crane_hook_height }} м
                        </span>
                        <span v-if="crane.crane_condition" class="ObjectHoldingsParameters-equipment-text">
                            /
                            {{ crane.crane_condition }}
                        </span>
                    </li>
                    <li class="ObjectHoldingsParameters-equipment-item-button">
                        <button @click="toggleAddCraneFormIsVisible" class="ObjectHoldingsParameters-equipment-button">
                            <i class="fas fa-plus-circle"></i> Добавить кран
                        </button>
                    </li>
                </ul>
                <p class="ObjectHoldingsParameters-equipment-label">Подъемники</p>
                <button @click="toggleAddElevatorFormIsVisible" class="ObjectHoldingsParameters-equipment-button">
                    <i class="fas fa-plus-circle"></i> Добавить подъемник
                </button>
            </div>
        </div>
        <!--		<div class="ObjectHoldingsParameters-floors" v-if="object.floors.length > 0">-->
        <!--			<div-->
        <!--					class="ObjectHoldingsParameters-floor"-->
        <!--					:class="{ danger: object.floors.danger }"-->
        <!--					v-for="floor in object.floors"-->
        <!--					:key="floor.number"-->
        <!--			>-->
        <!--				<span>{{ floor.number }} этаж</span>-->
        <!--				<i-->
        <!--						class="fas fa-exclamation-circle text-danger"-->
        <!--						v-if="floor.danger"-->
        <!--						title="Внимание"-->
        <!--				></i>-->
        <!--			</div>-->
        <!--		</div>-->
    </div>
</template>

<script>
import { unitTypes } from '@/const/unitTypes';
import { objectPurposes } from '@/const/types';
import WithUnitType from '@/components/common/WithUnitType.vue';
import ComplexParameters from '@/components/Complex/ComplexParameters.vue';
import FormComplexCrane from '@/components/Forms/Complex/FormComplexCrane.vue';
import FormComplexElevator from '@/components/Forms/Complex/FormComplexElevator.vue';

export default {
    name: 'ComplexHoldingParameters',
    components: {
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
            addCraneFormIsVisible: false,
            addElevatorFormIsVisible: false,
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
                this.object.floorsRecords.reduce((areaAllFloors, floor) => areaAllFloors + floor.area_floor_full, 0)
            );
        }
    },
    methods: {
        toggleAddCraneFormIsVisible() {
            this.addCraneFormIsVisible = !this.addCraneFormIsVisible;
        },
        toggleAddElevatorFormIsVisible() {
            this.addElevatorFormIsVisible = !this.addElevatorFormIsVisible;
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