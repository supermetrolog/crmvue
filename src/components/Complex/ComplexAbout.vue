<template>
    <div id="ComplexAbout" class="complex-about">
        <Tabs closed :options="{ useUrlFragment: false }">
            <Tab v-if="complex" name="О комплексе">
                <div class="complex-about__content">
                    <PropertyGrid
                        :template="[
                            ['areas', 'security'],
                            ['communications'],
                            ['railway', 'infrastructure']
                        ]"
                        :sections="parameters"
                    />
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
                                        :href="$url.file(presentation)"
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

<script>
import PropertyGrid from '@/components/common/Property/PropertyGrid.vue';
import { mapper } from '@/utils/mapper';
import { entityProperties } from '@/const/properties/properties';

export default {
    name: 'ComplexAbout',
    components: { PropertyGrid },
    inject: {
        injectedIsMobile: {
            from: 'isMobile'
        }
    },
    props: {
        complex: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            unitTypes,
            isMobile: this.injectedIsMobile
        };
    },
    computed: {
        parameters() {
            return mapper.propertiesToTableFormatWithSections(
                this.complex,
                entityProperties.complex.characteristicsWithSections
            );
        }
    }
};
</script>
