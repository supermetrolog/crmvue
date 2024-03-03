<template>
    <div class="deal-floors">
        <teleport to="body">
            <FormComplexFloorBlock
                v-if="blockFormIsVisible"
                @close="toggleCreateBlockForm"
                :object="object"
                :floor="currentEditFloor"
                :section="currentEditSection"
            />
            <FormComplexFloor
                v-if="floorFormIsVisible"
                @close="toggleEditFloorForm"
                :object="object"
                :floor="currentEditFloor"
            />
        </teleport>
        <ul class="deal-floors__list">
            <li v-for="floor in floors" :key="floor.name" class="deal-floors__item">
                <ComplexDealFloorHead
                    @openForm="toggleCreateBlockForm(floor)"
                    @openEditForm="toggleEditFloorForm(floor)"
                    :area="getFloorArea(floor)"
                    :checked="floor.checked"
                    :number="floor.number"
                />
                <div class="deal-floors__separator">
                    <i class="fas fa-arrow-right"></i>
                </div>
            </li>
        </ul>
        <div class="deal-floors__sections">
            <div class="deal-floors__body">
                <div v-for="floor in floors" :key="floor.name" class="deal-floors__line">
                    <ComplexDealFloorSection
                        v-for="section in floor.parts"
                        :key="section.id"
                        @edit-section="openEditBlockForm"
                        :style="{
                            width: getSectionWidth(getFloorArea(floor), section.area_floor_max)
                        }"
                        :class="{
                            'deal-section--single':
                                getUnknownSectionArea(floor) <= 0 && floor.parts.length === 1
                        }"
                        :section="section"
                        :floor-name="floor.name"
                    />
                    <ComplexDealFloorSection
                        v-if="getUnknownSectionArea(floor) > 0"
                        :style="{
                            width: getSectionWidth(
                                getFloorArea(floor),
                                getUnknownSectionArea(floor)
                            )
                        }"
                        :class="{
                            'deal-section--single': floor.parts.length === 0
                        }"
                        empty
                        :empty-area="getUnknownSectionArea(floor)"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FormComplexFloorBlock from '@/components/Forms/Complex/FormComplexFloorBlock.vue';
import ComplexDealFloorHead from '@/components/Complex/Deal/ComplexDealFloorHead.vue';
import ComplexDealFloorSection from '@/components/Complex/Deal/ComplexDealFloorSection.vue';
import { reducer } from '@/utils';
import FormComplexFloor from '@/components/Forms/Complex/FormComplexFloor.vue';

export default {
    name: 'ComplexDealFloors',
    components: {
        FormComplexFloor,
        ComplexDealFloorSection,
        ComplexDealFloorHead,
        FormComplexFloorBlock
    },
    props: {
        floors: {
            type: Array,
            default: () => []
        },
        object: {
            object: Object,
            required: true
        }
    },
    data() {
        return {
            blockFormIsVisible: false,
            floorFormIsVisible: false,
            currentEditSection: null,
            currentEditFloor: null
        };
    },
    methods: {
        getFloorArea(floor) {
            return floor.area_floor_full || floor.area_mezzanine_full || floor.area_field_full || 0;
        },
        toggleCreateBlockForm(floor = null) {
            this.currentEditFloor = floor;
            this.currentEditSection = null;
            this.blockFormIsVisible = !this.blockFormIsVisible;
        },
        getSectionWidth(mainArea, sectionArea) {
            return `${(sectionArea / mainArea) * 100}%`;
        },
        getUnknownSectionArea(floor) {
            if (floor.area_floor_full) {
                return floor.area_floor_full - reducer.sum(floor.parts, 'area_floor_max');
            }

            if (floor.area_mezzanine_full) {
                return floor.area_mezzanine_full - reducer.sum(floor.parts, 'area_mezzanine_max');
            }

            if (floor.area_field_full) {
                return floor.area_field_full - reducer.sum(floor.parts, 'area_field_max');
            }

            return '--';
        },
        toggleEditFloorForm(floor = null) {
            this.currentEditFloor = floor;
            this.floorFormIsVisible = !this.floorFormIsVisible;
        },
        openEditBlockForm(section) {
            this.currentEditSection = section;
            this.blockFormIsVisible = true;
        }
    }
};
</script>
