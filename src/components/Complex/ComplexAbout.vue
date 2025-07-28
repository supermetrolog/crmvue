<template>
    <div id="ComplexAbout" class="complex-about">
        <Tabs
            nav-class="complex-tabs"
            nav-item-link-class="complex-tabs__link dashboard-chip"
            closed
            :options="{ useUrlFragment: false }"
        >
            <Tab v-if="complex" name="О комплексе">
                <div class="complex-about__content">
                    <PropertyGrid :template="template" :sections="parameters" />
                </div>
            </Tab>
            <Tab name="План Территории">
                <div class="complex-about__content">План не загружен</div>
            </Tab>
            <Tab name="Презентации">
                <div class="row">
                    <div class="col-12">
                        <div class="complex__list">
                            <template v-if="complex.building_presentations.length">
                                <div
                                    v-for="(presentation, index) in complex.building_presentations"
                                    :key="index"
                                    class="complex-document"
                                >
                                    <a
                                        :href="getLinkFile(presentation)"
                                        target="_blank"
                                        class="complex-document__link"
                                    >
                                        <i
                                            class="fa-regular fa-file-powerpoint complex-document__preview"
                                        />
                                        <p class="complex-document__name">
                                            Презентация #{{ index + 1 }}
                                        </p>
                                    </a>
                                </div>
                            </template>
                            <div class="complex-document complex-document--green">
                                <a href="#" class="complex-document__link">
                                    <i
                                        class="fa-regular fa-file-powerpoint complex-document__preview"
                                    />
                                    <p class="complex-document__name">Добавить презентацию</p>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </Tab>
            <Tab name="Документы">
                <div class="row">
                    <div class="col-12">
                        <div class="complex__list">
                            <div class="complex-document complex-document--green">
                                <a href="#" class="complex-document__link">
                                    <i class="fa-regular fa-file-word complex-document__preview" />
                                    <p class="complex-document__name">Добавить документ</p>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </Tab>
        </Tabs>
    </div>
</template>

<script setup>
import PropertyGrid from '@/components/common/Property/PropertyGrid.vue';
import { mapper } from '@/utils/mapper';
import { entityProperties } from '@/const/properties/properties';
import { computed } from 'vue';
import { getLinkFile } from '@/utils/url.js';

const props = defineProps({
    complex: {
        type: Object,
        required: true
    }
});

const template = [['areas', 'security'], ['communications'], ['railway', 'infrastructure']];

const parameters = computed(() => {
    return mapper.propertiesToTableFormatWithSections(
        props.complex,
        entityProperties.complex.characteristicsWithSections
    );
});
</script>
