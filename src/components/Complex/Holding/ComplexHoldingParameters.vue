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
                    <FormComplexCrane
                        v-if="addCraneFormIsVisible"
                        @close="toggleAddCraneFormIsVisible"
                        :crane="forms.crane"
                    />
                </teleport>
                <teleport to="body">
                    <FormComplexElevator
                        v-if="addElevatorFormIsVisible"
                        @close="toggleAddElevatorFormIsVisible"
                    />
                </teleport>
                <p class="object-holding__label">Краны</p>
                <ul class="object-holding__list mb-2">
                    <ComplexHoldingParametersCrane
                        v-for="crane in object.cranes"
                        :key="crane.id"
                        @click.stop="toggleEditCraneFormIsVisible(crane)"
                        :crane="crane"
                    />
                    <li>
                        <button @click.stop="toggleAddCraneFormIsVisible" class="object-equipment">
                            <i class="fas fa-plus-circle"></i> Добавить кран
                        </button>
                    </li>
                </ul>
                <p class="object-holding__label">Подъемники</p>
                <ul class="object-holding__list">
                    <li>
                        <button @click="toggleAddElevatorFormIsVisible" class="object-equipment">
                            <i class="fas fa-plus-circle"></i> Добавить подъемник
                        </button>
                    </li>
                </ul>
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
import ComplexHoldingParametersCrane from '@/components/Complex/Holding/ComplexHoldingParametersCrane.vue';
import { reducer } from '@/utils';

export default {
    name: 'ComplexHoldingParameters',
    components: {
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
            addCraneFormIsVisible: false,
            addElevatorFormIsVisible: false,
            forms: {
                crane: null,
                elevator: null
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
                reducer.sum(this.object.floorsRecords, 'area_floor_full')
            );
        }
    },
    methods: {
        toggleAddCraneFormIsVisible() {
            this.forms.crane = null;
            this.addCraneFormIsVisible = !this.addCraneFormIsVisible;
        },
        toggleEditCraneFormIsVisible(crane) {
            this.forms.crane = crane;
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
