<template>
    <div class="ObjectHoldingsTabs">
        <ComplexActions simple class="ObjectHoldingsTabs-buttons" :buttons="actionButtons" />
        <Tabs ref="tabs" closed :options="{ useUrlFragment: false }">
            <Tab name="Характеристики">
                <PropertyGrid
                    v-if="object.is_land"
                    :template="sectionsTemplate"
                    :sections="sections"
                />
                <PropertyGrid v-else :columns="4" :sections="sections" />
            </Tab>
            <Tab :id="`deals-${object.id}`" :name="`Сделки (${object.commercialOffers.length})`">
                <div class="ObjectHoldingsTabs-content">
                    <ComplexDeals
                        :object="object"
                        :deals="object.commercialOffers"
                        :floors="floors"
                    />
                </div>
            </Tab>
            <Tab name="Карта сделок">
                <p>В разработке..</p>
            </Tab>
            <Tab name="Описание">
                <div v-if="object.description" v-html="object.description"></div>
                <EmptyData v-else>Описание отсутствует..</EmptyData>
            </Tab>
            <Tab name="Планировки">
                <div class="object-holdings-tabs__list">
                    <template v-if="object.building_layouts.length">
                        <div
                            v-for="(layout, index) in object.building_layouts"
                            :key="index"
                            class="complex-document"
                        >
                            <a :href="layout" target="_blank" class="complex-document__link">
                                <i class="fa-regular fa-file complex-document__preview" />
                                <p class="complex-document__name">Планировка #{{ index }}</p>
                            </a>
                        </div>
                    </template>
                    <div class="complex-document complex-document--green">
                        <a href="#" class="complex-document__link">
                            <i class="fa-regular fa-file complex-document__preview" />
                            <p class="complex-document__name">Добавить планировку</p>
                        </a>
                    </div>
                </div>
            </Tab>
            <Tab name="Презентации">
                <div class="object-holdings-tabs__list">
                    <template v-if="object.building_presentations.length">
                        <div
                            v-for="(presentation, index) in object.building_presentations"
                            :key="index"
                            class="complex-document"
                        >
                            <a :href="presentation" target="_blank" class="complex-document__link">
                                <i
                                    class="fa-regular fa-file-powerpoint complex-document__preview"
                                />
                                <p class="complex-document__name">Презентация #{{ index }}</p>
                            </a>
                        </div>
                    </template>
                    <div class="complex-document complex-document--green">
                        <a href="#" class="complex-document__link">
                            <i class="fa-regular fa-file-powerpoint complex-document__preview" />
                            <p class="complex-document__name">Добавить презентацию</p>
                        </a>
                    </div>
                </div>
            </Tab>
            <Tab name="Договоры">
                <div class="object-holdings-tabs__list">
                    <template v-if="object.building_contracts && object.building_contracts.length">
                        <div
                            v-for="(contract, index) in object.building_contracts"
                            :key="index"
                            class="complex-document"
                        >
                            <a :href="contract" target="_blank" class="complex-document__link">
                                <i class="fa-regular fa-file-pdf complex-document__preview" />
                                <p class="complex-document__name">Контракт #{{ index }}</p>
                            </a>
                        </div>
                    </template>
                    <div class="complex-document complex-document--green">
                        <a href="#" class="complex-document__link">
                            <i class="fa-regular fa-file-pdf complex-document__preview" />
                            <p class="complex-document__name">Добавить контракт</p>
                        </a>
                    </div>
                </div>
            </Tab>
            <Tab name="Задачи">
                <p>В разработке..</p>
            </Tab>
        </Tabs>
    </div>
</template>

<script>
import ComplexDeals from '@/components/Complex/Deal/ComplexDeals.vue';
import ComplexActions from '@/components/Complex/ComplexActions.vue';
import { mapper } from '@/utils/mapper';
import { entityProperties } from '@/const/properties/properties';
import PropertyGrid from '@/components/common/Property/PropertyGrid.vue';
import EmptyData from '@/components/common/EmptyData.vue';

export default {
    name: 'ComplexHoldingTabs',
    components: {
        EmptyData,
        PropertyGrid,
        ComplexActions,
        ComplexDeals
    },
    inject: { openDownloader: 'openDownloader' },
    props: {
        object: {
            type: Object,
            required: true
        }
    },
    computed: {
        actionButtons() {
            return {
                edit: {},
                dislike: { value: false },
                notifications: { value: false },
                delete: {},
                cadastral: {
                    disabled: !this.object.cadastral_number,
                    handler: () => {
                        window.open(this.$url.cadastral(this.object.cadastral_number), '_blank');
                    }
                },
                photos: {
                    disabled: !this.objectPhoto.length,
                    handler: () => this.openDownloader(this.objectPhoto, `Объект-${this.object.id}`)
                }
            };
        },
        objectPhoto() {
            return this.object.photo
                ? this.object.photo.map(el => ({
                      src: this.$url.api.objects() + el
                  }))
                : [];
        },
        floors() {
            return this.object.floorsRecords.filter(floor => floor.number);
        },
        sections() {
            const properties = this.object.is_land
                ? entityProperties.object.characteristicsForLandWithSections
                : entityProperties.object.characteristicsWithSections;

            return mapper.propertiesToTableFormatWithSections(this.object, properties);
        },
        sectionsTemplate() {
            return [
                ['main', 'security'],
                ['railway', 'communications'],
                ['infrastructure', 'allow']
            ];
        }
    },
    mounted() {
        if (this.$route.query.offer_id) {
            const offerId = this.$route.query.offer_id;

            const objectHasTargetDeal = this.object.commercialOffers.some(
                offer => offer.id == offerId
            );

            if (objectHasTargetDeal) this.$refs.tabs.selectTab('#deals-' + this.object.id);
        }
    }
};
</script>
