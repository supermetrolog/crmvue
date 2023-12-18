<template>
    <div class="DealFloors">
        <div class="DealFloors-body">
            <teleport to="body">
                <FormComplexFloorBlock
                    v-if="createBlockFormIsVisible"
                    @close="toggleCreateBlockForm"
                    :object="object"
                />
            </teleport>
            <ul class="DealFloors-head-list">
                <li v-for="floor in floorWithSortedSections" :key="floor.name" class="DealFloors-head-list-item">
                    <!-- КРАЙНИЙ ЛЕВЫЙ ТЕМНО СЕРЫЙ БЛОК С ЭТАЖЕМ -->
                    <ComplexDealFloorHead
                        @openForm="toggleCreateBlockForm"
                        :area="floor.area"
                        :checked="floor.checked"
                        :name="floor.name"
                    />
                    <div class="DealFloors-separator">
                        <i class="fas fa-arrow-right"></i>
                    </div>
                </li>
            </ul>
            <div class="DealFloors-sections">
                <div class="DealFloors-sections-body">
                    <div v-for="floor in floorWithSortedSections" :key="floor.name" class="DealFloors-sections-line">
                        <!-- КОМПОНЕНТ ОТДЕЛЬНЫХ СЕКЦИЙ НА ЭТАЖАХ -->
                        <ComplexDealFloorSection
                            v-for="(section, idx) in getSectionsWithKnownArea(floor.sections)"
                            :key="idx"
                            :style="{
                                width: getSectionWidth(floor.area.valueMax, section.area.valueMax)
                            }"
                            :section="section"
                            :floor-name="floor.name"
                        />
                        <ComplexDealFloorSection
                            v-if="getUnknownSectionArea(floor.sections, floor.area.valueMax) > 0"
                            :style="{
                                width: getSectionWidth(
                                    floor.area.valueMax,
                                    getUnknownSectionArea(floor.sections, floor.area.valueMax)
                                )
                            }"
                            :section="{
                                area: getUnknownSectionArea(floor.sections, floor.area.valueMax),
                                status: null,
                                checked: null
                            }"
                            :floor-name="floor.name"
                            :unknown-area-companies="getSectionsNameWithUnKnownArea(floor.sections)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { DealStatusType } from '@/const/const';
import FormComplexFloorBlock from '@/components/Forms/Complex/FormComplexFloorBlock.vue';
import ComplexDealFloorHead from '@/components/Complex/Deal/ComplexDealFloorHead.vue';
import ComplexDealFloorSection from '@/components/Complex/Deal/ComplexDealFloorSection.vue';

export default {
    name: 'ComplexDealFloors',
    components: { ComplexDealFloorSection, ComplexDealFloorHead, FormComplexFloorBlock },
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
            DealStatusType,
            createBlockFormIsVisible: false
        };
    },
    computed: {
        floorWithSortedSections() {
            return this.floors.map(floor => ({
                ...floor,
                sections: [
                    ...floor.sections.filter(section => section.company && section.area),
                    ...floor.sections.filter(section => section.status === DealStatusType.FREE),
                    ...floor.sections.filter(section => !section.area)
                ]
            }));
        }
    },
    methods: {
        toggleCreateBlockForm() {
            this.createBlockFormIsVisible = !this.createBlockFormIsVisible;
        },
        getSectionWidth(mainArea, sectionArea) {
            return `${(sectionArea / mainArea) * 100}%`;
        },
        getUnknownSectionArea(sections, floorArea) {
            return sections
                .filter(section => section.area)
                .reduce((accumulator, section) => accumulator - section.area.valueMax, floorArea);
        },
        getSectionsWithKnownArea(sections) {
            return sections.filter(section => section.area);
        },
        getSectionsNameWithUnKnownArea(sections) {
            const res = sections.filter(section => !section.area).map(section => section.company.name);

            return res;
        },
        getAppropriateSectionClass(section) {
            switch (section.status) {
                case DealStatusType.FREE:
                    return 'DealFloors-section_green';
                default:
                    if (section.company) {
                        return 'DealFloors-section_purple';
                    }
                    return 'DealFloors-section_grey';
            }
        }
    }
};
</script>
